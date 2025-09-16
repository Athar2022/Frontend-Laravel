<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Aid Requests</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage aid requests from beneficiaries</p>
      </div>
      <button 
        v-if="user.role === 'beneficiary'"
        @click="showCreateModal = true"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Request
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" class="input-field w-full md:w-auto">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        
        <select v-model="filters.type" class="input-field w-full md:w-auto">
          <option value="">All Types</option>
          <option value="food">Food</option>
          <option value="clothing">Clothing</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
        </select>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Search requests..."
          class="input-field w-full md:w-64"
        />
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Beneficiary
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
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
            <tr v-for="request in filteredRequests" :key="request.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {{ request.beneficiary_name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ request.beneficiary_name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ request.beneficiary_email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeClass(request.type)">
                  {{ request.type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {{ request.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(request.status)">
                  {{ request.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewRequest(request)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </button>
                <button 
                  v-if="['admin', 'volunteer'].includes(user.role) && request.status === 'pending'"
                  @click="updateRequestStatus(request.id, 'approved')"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  Approve
                </button>
                <button 
                  v-if="['admin', 'volunteer'].includes(user.role) && request.status === 'pending'"
                  @click="updateRequestStatus(request.id, 'rejected')"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Reject
                </button>
              </td>
            </tr>
            
            <tr v-if="filteredRequests.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">
                <p class="text-gray-500 dark:text-gray-400">No aid requests found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-400">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="pagination.currentPage === 1"
              class="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              @click="nextPage"
              :disabled="pagination.currentPage === pagination.lastPage"
              class="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Request Modal -->
    <CreateRequestModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleRequestCreated"
    />

    <!-- View Request Modal -->
    <ViewRequestModal 
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
      @updated="handleRequestUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import CreateRequestModal from '@/components/requests/CreateRequestModal.vue'
import ViewRequestModal from '@/components/requests/ViewRequestModal.vue'

const authStore = useAuthStore()
const requests = ref([])
const selectedRequest = ref(null)
const showCreateModal = ref(false)
const filters = ref({
  status: '',
  type: '',
  search: ''
})
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  lastPage: 1
})

const user = computed(() => authStore.user || {})
const filteredRequests = computed(() => {
  return requests.value.filter(request => {
    const matchesStatus = !filters.value.status || request.status === filters.value.status
    const matchesType = !filters.value.type || request.type === filters.value.type
    const matchesSearch = !filters.value.search || 
      request.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      request.beneficiary_name.toLowerCase().includes(filters.value.search.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  })
})

onMounted(() => {
  fetchRequests()
})

watch(filters, () => {
  pagination.value.currentPage = 1
  fetchRequests()
}, { deep: true })

async function fetchRequests() {
  try {
    const params = {
      page: pagination.value.currentPage,
      per_page: pagination.value.perPage,
      ...filters.value
    }

    const response = await api.get('/aid-requests', { params })
    requests.value = response.data.data
    pagination.value = {
      currentPage: response.data.current_page,
      perPage: response.data.per_page,
      total: response.data.total,
      lastPage: response.data.last_page,
      from: response.data.from,
      to: response.data.to
    }
  } catch (error) {
    console.error('Failed to fetch requests:', error)
    window.showToast('error', 'Error', 'Failed to load aid requests')
  }
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function getTypeClass(type) {
  const classes = {
    food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    clothing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    medical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    shelter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function viewRequest(request) {
  selectedRequest.value = request
}

async function updateRequestStatus(requestId, status) {
  try {
    await api.patch(`/aid-requests/${requestId}`, { status })
    window.showToast('success', 'Success', `Request ${status} successfully`)
    fetchRequests()
  } catch (error) {
    console.error('Failed to update request:', error)
    window.showToast('error', 'Error', 'Failed to update request status')
  }
}

function handleRequestCreated() {
  showCreateModal.value = false
  fetchRequests()
  window.showToast('success', 'Success', 'Aid request created successfully')
}

function handleRequestUpdated() {
  selectedRequest.value = null
  fetchRequests()
}

function nextPage() {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    pagination.value.currentPage++
    fetchRequests()
  }
}

function prevPage() {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
    fetchRequests()
  }
}
</script>