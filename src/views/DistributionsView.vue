<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Distributions Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Track and manage aid distributions</p>
      </div>
      <button 
        v-if="user.role === 'admin'"
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Distribution
      </button>
    </div>

    <!-- Distributions Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Volunteer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Beneficiary
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Donation
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
            <tr v-for="distribution in distributions" :key="distribution.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {{ distribution.volunteer?.name?.charAt(0) || 'V' }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ distribution.volunteer?.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Volunteer
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                    {{ distribution.beneficiary?.name?.charAt(0) || 'B' }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ distribution.beneficiary?.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Beneficiary
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ distribution.donation?.type }} ({{ distribution.donation?.quantity }})
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ distribution.donation?.donor_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(distribution.delivery_status)">
                  {{ distribution.delivery_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(distribution.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDistribution(distribution)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </button>
                <button 
                  v-if="user.role === 'admin' || user.id === distribution.volunteer_id"
                  @click="updateDistributionStatus(distribution.id, 'in_progress')"
                  class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-3"
                  :disabled="distribution.delivery_status !== 'assigned'"
                >
                  Start
                </button>
                <button 
                  v-if="user.role === 'admin' || user.id === distribution.volunteer_id"
                  @click="updateDistributionStatus(distribution.id, 'delivered')"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  :disabled="distribution.delivery_status !== 'in_progress'"
                >
                  Deliver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Distribution Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Distribution</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createDistribution" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volunteer</label>
            <select v-model="newDistribution.volunteer_id" required class="input-field">
              <option value="">Select volunteer</option>
              <option v-for="volunteer in volunteers" :key="volunteer.id" :value="volunteer.id">
                {{ volunteer.name }} - {{ volunteer.email }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beneficiary</label>
            <select v-model="newDistribution.beneficiary_id" required class="input-field">
              <option value="">Select beneficiary</option>
              <option v-for="beneficiary in beneficiaries" :key="beneficiary.id" :value="beneficiary.id">
                {{ beneficiary.name }} - {{ beneficiary.email }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation</label>
            <select v-model="newDistribution.donation_id" required class="input-field">
              <option value="">Select donation</option>
              <option v-for="donation in approvedDonations" :key="donation.id" :value="donation.id">
                {{ donation.type }} ({{ donation.quantity }}) - {{ donation.donor_name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="loading" class="btn-primary">Create Distribution</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDistributionStore } from '@/stores/distribution'
import { useUserStore } from '@/stores/user'
import { useDonationStore } from '@/stores/donation'
import { useAuthStore } from '@/stores/auth'

const distributionStore = useDistributionStore()
const userStore = useUserStore()
const donationStore = useDonationStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const loading = ref(false)

const newDistribution = ref({
  volunteer_id: '',
  beneficiary_id: '',
  donation_id: ''
})

const user = computed(() => authStore.user || {})
const distributions = computed(() => distributionStore.distributions)
const volunteers = computed(() => userStore.users.filter(u => u.role === 'volunteer'))
const beneficiaries = computed(() => userStore.users.filter(u => u.role === 'beneficiary'))
const approvedDonations = computed(() => donationStore.donations.filter(d => d.status === 'approved'))

onMounted(async () => {
  await distributionStore.fetchDistributions()
  await userStore.fetchUsers()
  await donationStore.fetchDonations()
})

function getStatusClass(status) {
  const classes = {
    assigned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

async function createDistribution() {
  loading.value = true
  try {
    await distributionStore.createDistribution(newDistribution.value)
    showCreateModal.value = false
    newDistribution.value = { volunteer_id: '', beneficiary_id: '', donation_id: '' }
    window.showToast('success', 'Success', 'Distribution created successfully')
  } catch (error) {
    console.error('Failed to create distribution:', error)
    window.showToast('error', 'Error', 'Failed to create distribution')
  } finally {
    loading.value = false
  }
}

async function updateDistributionStatus(id, status) {
  try {
    await distributionStore.updateDistributionStatus(id, status)
    window.showToast('success', 'Success', `Distribution status updated to ${status}`)
  } catch (error) {
    console.error('Failed to update distribution status:', error)
    window.showToast('error', 'Error', 'Failed to update distribution status')
  }
}

function viewDistribution(distribution) {
  console.log('View distribution:', distribution)
}
</script>