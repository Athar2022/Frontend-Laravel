import { api } from './api'

export const aidRequestService = {
  async getAll(params = {}) {
    const response = await api.get('/aid-requests', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/aid-requests/${id}`)
    return response.data
  },

  async create(requestData) {
    const formData = new FormData()
    
    Object.keys(requestData).forEach(key => {
      if (requestData[key] !== null && requestData[key] !== undefined) {
        formData.append(key, requestData[key])
      }
    })

    if (requestData.documents && requestData.documents.length > 0) {
      requestData.documents.forEach(file => {
        formData.append('documents[]', file)
      })
    }

    const response = await api.post('/aid-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async update(id, updateData) {
    const response = await api.patch(`/aid-requests/${id}`, updateData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/aid-requests/${id}`)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/aid-requests/${id}`, { status })
    return response.data
  }
}