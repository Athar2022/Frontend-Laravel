<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Donations Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage all donations and their status</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary"
        v-if="user.role === 'admin'"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Donation
      </button>
    </div>

    <!-- Donations Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Donor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="donation in donations" :key="donation.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ donation.donor_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {{ donation.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ donation.quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(donation.status)">
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(donation.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDonation(donation)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </button>
                <button 
                  v-if="user.role === 'admin' && donation.status === 'pending'"
                  @click="approveDonation(donation.id)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  Approve
                </button>
                <button 
                  v-if="user.role === 'admin' && donation.status === 'approved'"
                  @click="markDistributed(donation.id)"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Mark Distributed
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Donation Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Donation</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createDonation" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donor Name</label>
            <input v-model="newDonation.donor_name" type="text" required class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select v-model="newDonation.type" required class="input-field">
              <option value="">Select type</option>
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="medical">Medical Supplies</option>
              <option value="shelter">Shelter Materials</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
            <input v-model="newDonation.quantity" type="number" min="1" required class="input-field">
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="loading" class="btn-primary">Create Donation</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDonationStore } from '@/stores/donationStore'
import { useAuthStore } from '@/stores/authStore'

const donationStore = useDonationStore()
const authStore = useAuthStore()
const showCreateModal = ref(false)
const loading = ref(false)

const newDonation = ref({
  donor_name: '',
  type: '',
  quantity: 1
})

const user = computed(() => authStore.user || {})
const donations = computed(() => donationStore.donations)

onMounted(async () => {
  await donationStore.fetchDonations()
})

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    distributed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

async function createDonation() {
  loading.value = true
  try {
    await donationStore.createDonation(newDonation.value)
    showCreateModal.value = false
    newDonation.value = { donor_name: '', type: '', quantity: 1 }
    window.showToast('success', 'Success', 'Donation created successfully')
  } catch (error) {
    console.error('Failed to create donation:', error)
    window.showToast('error', 'Error', 'Failed to create donation')
  } finally {
    loading.value = false
  }
}

async function approveDonation(id) {
  try {
    await donationStore.approveDonation(id)
    window.showToast('success', 'Success', 'Donation approved successfully')
  } catch (error) {
    console.error('Failed to approve donation:', error)
    window.showToast('error', 'Error', 'Failed to approve donation')
  }
}

async function markDistributed(id) {
  try {
    await donationStore.markDonationDistributed(id)
    window.showToast('success', 'Success', 'Donation marked as distributed')
  } catch (error) {
    console.error('Failed to mark donation as distributed:', error)
    window.showToast('error', 'Error', 'Failed to update donation status')
  }
}

function viewDonation(donation) {
  // سيتم تنفيذ عرض تفاصيل التبرع لاحقاً
  console.log('View donation:', donation)
}
</script>