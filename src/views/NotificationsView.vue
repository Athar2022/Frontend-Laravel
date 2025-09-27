<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your notifications</p>
      </div>
      <button 
        @click="markAllAsRead"
        class="btn-secondary"
        :disabled="unreadCount === 0"
      >
        Mark All as Read
      </button>
    </div>

    <!-- Notifications List -->
    <div class="card">
      <div class="space-y-4">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="p-4 border-l-4 rounded-r-lg"
          :class="notification.status === 'unread' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 bg-gray-50 dark:bg-gray-800'"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(notification.created_at) }}
              </p>
            </div>
            <div class="flex space-x-2 ml-4">
              <button 
                v-if="notification.status === 'unread'"
                @click="markAsRead(notification.id)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                Mark Read
              </button>
              <button 
                @click="deleteNotification(notification.id)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-if="notifications.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No notifications found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
const loading = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

onMounted(async () => {
  await notificationStore.fetchNotifications()
  await notificationStore.fetchUnreadCount()
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function markAsRead(id) {
  try {
    await notificationStore.markAsRead(id)
    window.showToast('success', 'Success', 'Notification marked as read')
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    window.showToast('error', 'Error', 'Failed to update notification')
  }
}

async function markAllAsRead() {
  try {
    await notificationStore.markAllAsRead()
    window.showToast('success', 'Success', 'All notifications marked as read')
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    window.showToast('error', 'Error', 'Failed to update notifications')
  }
}

async function deleteNotification(id) {
  try {
    await notificationStore.deleteNotification(id)
    window.showToast('success', 'Success', 'Notification deleted successfully')
  } catch (error) {
    console.error('Failed to delete notification:', error)
    window.showToast('error', 'Error', 'Failed to delete notification')
  }
}
</script>