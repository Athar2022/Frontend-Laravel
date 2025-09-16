<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
      <!-- Modal header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Create New Aid Request
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
      <form @submit.prevent="submitRequest" class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Request Type *
          </label>
          <select
            v-model="form.type"
            required
            class="input-field"
          >
            <option value="">Select type</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
            <option value="medical">Medical Supplies</option>
            <option value="shelter">Shelter</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority Level *
          </label>
          <select
            v-model="form.priority"
            required
            class="input-field"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            v-model="form.description"
            required
            rows="4"
            class="input-field"
            placeholder="Please describe your needs in detail..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity Needed
          </label>
          <input
            v-model="form.quantity"
            type="number"
            min="1"
            class="input-field"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Urgency Date
          </label>
          <input
            v-model="form.urgency_date"
            type="date"
            class="input-field"
            :min="new Date().toISOString().split('T')[0]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Supporting Documents
          </label>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            class="input-field"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Upload ID documents or proof of need (Max 5MB per file)
          </p>
        </div>

        <!-- File preview -->
        <div v-if="uploadedFiles.length > 0" class="mt-2">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected files:</p>
          <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded mb-1">
            <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ file.name }}</span>
            <button
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary disabled:opacity-50"
          >
            <span v-if="loading">Creating...</span>
            <span v-else>Create Request</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { api } from '@/services/api'

const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const fileInput = ref(null)
const uploadedFiles = ref([])

const form = reactive({
  type: '',
  priority: '',
  description: '',
  quantity: 1,
  urgency_date: '',
  documents: []
})

function handleFileUpload(event) {
  const files = event.target.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      window.showToast('error', 'File too large', `${file.name} exceeds 5MB limit`)
      continue
    }
    uploadedFiles.value.push(file)
  }
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1)
}

async function submitRequest() {
  loading.value = true

  try {
    const formData = new FormData()
    
    // Add form fields
    Object.keys(form).forEach(key => {
      if (form[key]) {
        formData.append(key, form[key])
      }
    })

    // Add uploaded files
    uploadedFiles.value.forEach(file => {
      formData.append('documents[]', file)
    })

    const response = await api.post('/aid-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    window.showToast('success', 'Success', 'Aid request created successfully')
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Failed to create aid request:', error)
    const message = error.response?.data?.message || 'Failed to create aid request'
    window.showToast('error', 'Error', message)
  } finally {
    loading.value = false
  }
}
</script>