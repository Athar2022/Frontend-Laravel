<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back, {{ user.name }}!</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Beneficiaries</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.beneficiaries || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Aid Requests</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.aid_requests || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Distributions</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.distributions || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Volunteers</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.volunteers || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {{ activity.userInitials }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ activity.description }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(activity.created_at) }}
            </p>
          </div>
        </div>
        
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const authStore = useAuthStore()
const stats = ref({})
const recentActivity = ref([])

const user = computed(() => authStore.user || {})

onMounted(async () => {
  await fetchDashboardData()
})

async function fetchDashboardData() {
  try {
    const [statsResponse] = await Promise.all([
      api.get('/dashboard/stats'),
      // يمكنك إضافة المزيد من الطلبات هنا عند الحاجة
    ])

    stats.value = statsResponse.data
    // للأنشطة الأخيرة، سنستخدم بيانات وهمية حتى تنشئ API لها
    recentActivity.value = [
      {
        id: 1,
        description: 'New aid request created',
        userInitials: 'TU',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        description: 'Donation approved',
        userInitials: 'AD',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    window.showToast('error', 'Error', 'Failed to load dashboard data')
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>