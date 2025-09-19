import { defineStore } from 'pinia'
import { ref } from 'vue'
import { distributionService } from '@/services/distributionService'

export const useDistributionStore = defineStore('distribution', () => {
  const distributions = ref([])
  const volunteerDistributions = ref([])
  const currentDistribution = ref(null)
  const loading = ref(false)

  const fetchDistributions = async () => {
    loading.value = true
    try {
      distributions.value = await distributionService.getAll()
    } catch (error) {
      console.error('Failed to fetch distributions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDistribution = async (id) => {
    loading.value = true
    try {
      currentDistribution.value = await distributionService.getById(id)
    } catch (error) {
      console.error('Failed to fetch distribution:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createDistribution = async (distributionData) => {
    try {
      const distribution = await distributionService.create(distributionData)
      distributions.value.push(distribution)
      return distribution
    } catch (error) {
      console.error('Failed to create distribution:', error)
      throw error
    }
  }

  const updateDistribution = async (id, distributionData) => {
    try {
      const distribution = await distributionService.update(id, distributionData)
      const index = distributions.value.findIndex(d => d.id === id)
      if (index !== -1) {
        distributions.value[index] = distribution
      }
      return distribution
    } catch (error) {
      console.error('Failed to update distribution:', error)
      throw error
    }
  }

  const deleteDistribution = async (id) => {
    try {
      await distributionService.delete(id)
      distributions.value = distributions.value.filter(d => d.id !== id)
    } catch (error) {
      console.error('Failed to delete distribution:', error)
      throw error
    }
  }

  const updateDistributionStatus = async (id, status) => {
    try {
      const distribution = await distributionService.updateStatus(id, status)
      const index = distributions.value.findIndex(d => d.id === id)
      if (index !== -1) {
        distributions.value[index] = distribution
      }
      return distribution
    } catch (error) {
      console.error('Failed to update distribution status:', error)
      throw error
    }
  }

  const fetchVolunteerDistributions = async () => {
    loading.value = true
    try {
      volunteerDistributions.value = await distributionService.getVolunteerDistributions()
    } catch (error) {
      console.error('Failed to fetch volunteer distributions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    distributions,
    volunteerDistributions,
    currentDistribution,
    loading,
    fetchDistributions,
    fetchDistribution,
    createDistribution,
    updateDistribution,
    deleteDistribution,
    updateDistributionStatus,
    fetchVolunteerDistributions
  }
})