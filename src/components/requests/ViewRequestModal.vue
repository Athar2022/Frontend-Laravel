<template>
  <div class="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl p-5 border shadow-lg rounded-md bg-white dark:bg-gray-800">
      <!-- Modal header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Aid Request Details
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal body -->
      <div v-if="request" class="mt-4 space-y-6">
        <!-- Request Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Beneficiary</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ request.beneficiary_name }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ request.beneficiary_email }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
            <span class="px-3 py-1 text-sm font-medium rounded-full" :class="statusClass">
              {{ request.status }}
            </span>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Request Type</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white capitalize">{{ request.type }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white capitalize">{{ request.priority }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity Needed</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ request.quantity || 'N/A' }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Urgency Date</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatDate(request.urgency_date) || 'N/A' }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created Date</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatDate(request.created_at) }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h4>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatDate(request.updated_at) }}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
          <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            {{ request.description }}
          </p>
        </div>

        <!-- Attachments -->
        <div v-if="request.documents && request.documents.length > 0">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Attachments</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(document, index) in request.documents"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ document.name }}</span>
              </div>
              <a
                :href="document.url"
                target="_blank"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2"
                title="Download"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Admin/Volunteer Actions -->
        <div v-if="canManageRequest" class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Manage Request</h4>
          <div class="flex space-x-3">
            <button
              v-if="request.status === 'pending'"
              @click="updateStatus('approved')"
              class="btn-primary"
            >
              Approve Request
            </button>
            <button
              v-if="request.status === 'pending'"
              @click="updateStatus('rejected')"
              class="btn-secondary bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Request
            </button>
            <button
              v-if="request.status === 'approved'"
              @click="updateStatus('completed')"
              class="btn-primary"
            >
              Mark as Completed
            </button>
            <button
              v-if="request.status === 'completed'"
              @click="updateStatus('approved')"
              class="btn-secondary"
            >
              Reopen Request
            </button>
          </div>
        </div>

        <!-- Status History -->
        <div v-if="request.status_history && request.status_history.length > 0">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Status History</h4>
          <div class="space-y-2">
            <div
              v-for="(history, index) in request.status_history"
              :key="index"
              class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getHistoryStatusClass(history.status)">
                {{ history.status }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                by {{ history.changed_by }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-500 ml-auto">
                {{ formatDate(history.changed_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])
const authStore = useAuthStore()

const statusClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[props.request.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
})

const canManageRequest = computed(() => {
  const userRole = authStore.user?.role
  return ['admin', 'volunteer'].includes(userRole) && props.request.status !== 'rejected'
})

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getHistoryStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

async function updateStatus(newStatus) {
  try {
    await api.patch(`/aid-requests/${props.request.id}`, { status: newStatus })
    window.showToast('success', 'Success', `Request status updated to ${newStatus}`)
    emit('updated')
  } catch (error) {
    console.error('Failed to update request status:', error)
    const message = error.response?.data?.message || 'Failed to update request status'
    window.showToast('error', 'Error', message)
  }
}
</script>