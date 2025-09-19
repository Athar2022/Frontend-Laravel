import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aidRequestService } from '@/services/aidRequestService'

export const useAidRequestStore = defineStore('aidRequest', () => {
  const requests = ref([])
  const currentRequest = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchRequests = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const data = await aidRequestService.getAll(params)
      requests.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch aid requests'
      console.error('Error fetching aid requests:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchRequestById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await aidRequestService.getById(id)
      currentRequest.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch aid request'
      console.error('Error fetching aid request:', err)
    } finally {
      loading.value = false
    }
  }

  const createRequest = async (requestData) => {
    loading.value = true
    error.value = null
    try {
      const data = await aidRequestService.create(requestData)
      requests.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create aid request'
      console.error('Error creating aid request:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateRequest = async (id, updateData) => {
    loading.value = true
    error.value = null
    try {
      const data = await aidRequestService.update(id, updateData)
      const index = requests.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requests.value[index] = data
      }
      if (currentRequest.value && currentRequest.value.id === id) {
        currentRequest.value = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update aid request'
      console.error('Error updating aid request:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteRequest = async (id) => {
    loading.value = true
    error.value = null
    try {
      await aidRequestService.delete(id)
      requests.value = requests.value.filter(req => req.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete aid request'
      console.error('Error deleting aid request:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateRequestStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const data = await aidRequestService.updateStatus(id, status)
      const index = requests.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requests.value[index] = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update aid request status'
      console.error('Error updating aid request status:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    requests,
    currentRequest,
    loading,
    error,
    fetchRequests,
    fetchRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    updateRequestStatus
  }
})