import { defineStore } from 'pinia'
import { ref } from 'vue'
import { distributionService } from '@/services/distributionService'

export const useDistributionStore = defineStore('distribution', () => {
  const distributions = ref([])
  const currentDistribution = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchDistributions = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.getAll()
      distributions.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch distributions'
      console.error('Error fetching distributions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDistributionById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.getById(id)
      currentDistribution.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch distribution'
      console.error('Error fetching distribution:', err)
    } finally {
      loading.value = false
    }
  }

  const createDistribution = async (distributionData) => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.create(distributionData)
      distributions.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create distribution'
      console.error('Error creating distribution:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateDistribution = async (id, distributionData) => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.update(id, distributionData)
      const index = distributions.value.findIndex(dist => dist.id === id)
      if (index !== -1) {
        distributions.value[index] = data
      }
      if (currentDistribution.value && currentDistribution.value.id === id) {
        currentDistribution.value = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update distribution'
      console.error('Error updating distribution:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteDistribution = async (id) => {
    loading.value = true
    error.value = null
    try {
      await distributionService.delete(id)
      distributions.value = distributions.value.filter(dist => dist.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete distribution'
      console.error('Error deleting distribution:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateDistributionStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.updateStatus(id, status)
      const index = distributions.value.findIndex(dist => dist.id === id)
      if (index !== -1) {
        distributions.value[index] = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update distribution status'
      console.error('Error updating distribution status:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchVolunteerDistributions = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await distributionService.getVolunteerDistributions()
      distributions.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch volunteer distributions'
      console.error('Error fetching volunteer distributions:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    distributions,
    currentDistribution,
    loading,
    error,
    fetchDistributions,
    fetchDistributionById,
    createDistribution,
    updateDistribution,
    deleteDistribution,
    updateDistributionStatus,
    fetchVolunteerDistributions
  }
})