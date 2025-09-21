import { api } from './api'

export const distributionService = {
  async getAll() {
    const response = await api.get('/distributions')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/distributions/${id}`)
    return response.data
  },

  async create(distributionData) {
    const response = await api.post('/distributions', distributionData)
    return response.data
  },

  async update(id, distributionData) {
    const response = await api.put(`/distributions/${id}`, distributionData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/distributions/${id}`)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.post(`/distributions/${id}/status/${status}`)
    return response.data
  },

  async getVolunteerDistributions() {
    const response = await api.get('/volunteer/distributions')
    return response.data
  }
}