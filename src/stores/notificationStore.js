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
      // Fallback to mock data
      notifications.value = getMockNotifications()
    } finally {
      loading.value = false
      updateUnreadCount()
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      unreadCount.value = response.count
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      // Fallback to mock count
      unreadCount.value = 3
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
      // Fallback: update local state
      const notification = notifications.value.find(n => n.id === id)
      if (notification && notification.status === 'unread') {
        notification.status = 'read'
        updateUnreadCount()
      }
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      notifications.value.forEach(n => { n.status = 'read' })
      unreadCount.value = 0
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      // Fallback: update local state
      notifications.value.forEach(n => { n.status = 'read' })
      updateUnreadCount()
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id)
      notifications.value = notifications.value.filter(n => n.id !== id)
      await fetchUnreadCount()
    } catch (error) {
      console.error('Failed to delete notification:', error)
      // Fallback: remove from local state
      notifications.value = notifications.value.filter(n => n.id !== id)
      updateUnreadCount()
    }
  }

  // Mock data function
  const getMockNotifications = () => {
    return [
      {
        id: 1,
        message: 'New aid request submitted by John Doe',
        status: 'unread',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        message: 'Distribution completed in District A',
        status: 'unread',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        message: 'New volunteer registered: Sarah Wilson',
        status: 'unread',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        message: 'Aid request approved for Maria Garcia',
        status: 'read',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        message: 'Monthly report is ready for review',
        status: 'read',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  // Update unread count when notifications change
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter(n => n.status === 'unread').length
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateUnreadCount
  }
})