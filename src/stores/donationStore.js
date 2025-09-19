import { defineStore } from 'pinia'
import { ref } from 'vue'
import { donationService } from '@/services/donationService'

export const useDonationStore = defineStore('donation', () => {
  const donations = ref([])
  const currentDonation = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchDonations = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.getAll()
      donations.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch donations'
      console.error('Error fetching donations:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDonationById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.getById(id)
      currentDonation.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch donation'
      console.error('Error fetching donation:', err)
    } finally {
      loading.value = false
    }
  }

  const createDonation = async (donationData) => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.create(donationData)
      donations.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create donation'
      console.error('Error creating donation:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateDonation = async (id, donationData) => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.update(id, donationData)
      const index = donations.value.findIndex(donation => donation.id === id)
      if (index !== -1) {
        donations.value[index] = data
      }
      if (currentDonation.value && currentDonation.value.id === id) {
        currentDonation.value = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update donation'
      console.error('Error updating donation:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteDonation = async (id) => {
    loading.value = true
    error.value = null
    try {
      await donationService.delete(id)
      donations.value = donations.value.filter(donation => donation.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete donation'
      console.error('Error deleting donation:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const approveDonation = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.approve(id)
      const index = donations.value.findIndex(donation => donation.id === id)
      if (index !== -1) {
        donations.value[index] = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to approve donation'
      console.error('Error approving donation:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const markDonationDistributed = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await donationService.markDistributed(id)
      const index = donations.value.findIndex(donation => donation.id === id)
      if (index !== -1) {
        donations.value[index] = data
      }
      return { success: true, data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to mark donation as distributed'
      console.error('Error marking donation as distributed:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    donations,
    currentDonation,
    loading,
    error,
    fetchDonations,
    fetchDonationById,
    createDonation,
    updateDonation,
    deleteDonation,
    approveDonation,
    markDonationDistributed
  }
})