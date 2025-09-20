<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <router-link
            :to="{ name: 'Login' }"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            sign in to your account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field mt-1"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Confirm your password"
            />
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="input-field mt-1"
            >
              <option value="">Select your role</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="input-field mt-1"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address (Optional)
            </label>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              class="input-field mt-1"
              placeholder="Enter your address"
            ></textarea>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  phone: '',
  address: ''
})

async function handleRegister() {
  loading.value = true
  errorMessage.value = ''

  // Validate password confirmation
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    loading.value = false
    return
  }

  const result = await authStore.register(form)
  
  if (result.success) {
    // Show success message
    if (window.showToast) {
      window.showToast('success', 'Success', 'Account created successfully!')
    }
    
    // Redirect to dashboard
    router.push({ name: 'Dashboard' })
  } else {
    // Show error message
    errorMessage.value = result.message
    if (window.showToast) {
      window.showToast('error', 'Error', result.message)
    }
  }
  
  loading.value = false
}
</script>