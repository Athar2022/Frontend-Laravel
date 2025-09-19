import { api } from './api'

export const userService = {
  async getAll() {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async delete(id) {
    await api.delete(`/users/${id}`)
  },

  async getByRole(role) {
    const response = await api.get(`/users/role/${role}`)
    return response.data
  },

  async getBeneficiaries() {
    const response = await api.get('/users/beneficiaries')
    return response.data
  },

  async getVolunteers() {
    const response = await api.get('/users/volunteers')
    return response.data
  }
}