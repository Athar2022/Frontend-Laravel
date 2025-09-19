import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationService } from '@/services/notificationService'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)

  const fetchNotifications = async () => {
    loading.value = true
    try {
      notifications.value = await notificationService.getAll()
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      unreadCount.value = response.count
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      throw error
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.update(id, { status: 'read' })
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.status = 'read'
      }
      await fetchUnreadCount()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      notifications.value.forEach(n => { n.status = 'read' })
      unreadCount.value = 0
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      throw error
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id)
      notifications.value = notifications.value.filter(n => n.id !== id)
      await fetchUnreadCount()
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
})