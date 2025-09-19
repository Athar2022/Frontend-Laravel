import { api } from './api'

export const donationService = {
  async getAll() {
    const response = await api.get('/donations')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/donations/${id}`)
    return response.data
  },

  async create(donationData) {
    const response = await api.post('/donations', donationData)
    return response.data
  },

  async update(id, donationData) {
    const response = await api.put(`/donations/${id}`, donationData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/donations/${id}`)
    return response.data
  },

  async approve(id) {
    const response = await api.post(`/donations/${id}/approve`)
    return response.data
  },

  async markDistributed(id) {
    const response = await api.post(`/donations/${id}/distribute`)
    return response.data
  }
}