<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>
    </div>

    <div class="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow ring-1 ring-black/5 dark:ring-gray-700">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <dt class="text-sm text-gray-500 dark:text-gray-400">Name</dt>
          <dd class="mt-1 text-gray-900 dark:text-gray-100">{{ user.name || '—' }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500 dark:text-gray-400">Email</dt>
          <dd class="mt-1 text-gray-900 dark:text-gray-100">{{ user.email || '—' }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500 dark:text-gray-400">Role</dt>
          <dd class="mt-1 text-gray-900 dark:text-gray-100">{{ user.role || '—' }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
</script>


