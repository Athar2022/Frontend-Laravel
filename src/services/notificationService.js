import { api } from './api'

export const notificationService = {
  async getAll() {
    const response = await api.get('/notifications')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/notifications/${id}`)
    return response.data
  },

  async create(notificationData) {
    const response = await api.post('/notifications', notificationData)
    return response.data
  },

  async update(id, notificationData) {
    const response = await api.put(`/notifications/${id}`, notificationData)
    return response.data
  },

  async delete(id) {
    await api.delete(`/notifications/${id}`)
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark-all-read')
    return response.data
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }
}