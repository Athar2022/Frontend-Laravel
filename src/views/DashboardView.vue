<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dashboard-page">
      <div class="flex flex-col space-y-8 lg:space-y-10">
        <!-- Header -->
        <DashboardHeader
          title="Dashboard"
          :subtitle="`Welcome back, ${user.name || ''}!`"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style="animation-delay: 0.1s">
        <StatCard label="Total Beneficiaries" :value="stats.beneficiaries || 0" color="blue">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Aid Requests" :value="stats.aid_requests || 0" color="green">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Distributions" :value="stats.distributions || 0" color="purple">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Volunteers" :value="stats.volunteers || 0" color="orange">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </StatCard>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up mt-10" style="animation-delay: 0.2s">
          <SectionCard title="Aid Requests by Status">
            <AidRequestsChart :data="normalizedCharts.aidRequests" />
          </SectionCard>
          <SectionCard title="Monthly Distributions">
            <DistributionsChart :data="normalizedCharts.distributions" />
          </SectionCard>
        </div>

        <!-- Recent Activity -->
        <SectionCard title="Recent Activity" class="animate-fade-in-up mt-10" style="animation-delay: 0.3s">
          <ActivityList :activities="recentActivityLimited" />
        </SectionCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import AidRequestsChart from '@/components/charts/AidRequestsChart.vue'
import DistributionsChart from '@/components/charts/DistributionsChart.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityList from '@/components/dashboard/ActivityList.vue'
// import icon from './assets/icon.png'

const authStore = useAuthStore()
const stats = ref({})
const chartData = ref({
  aidRequests: {},
  distributions: {}
})
const normalizedCharts = ref({
  aidRequests: {
    'Pending': 23,
    'Approved': 45,
    'In Progress': 12,
    'Completed': 9
  },
  distributions: {
    'January': 45,
    'February': 52,
    'March': 38,
    'April': 61,
    'May': 48,
    'June': 55
  }
})
const recentActivity = ref([])

const user = computed(() => authStore.user || {})
const recentActivityLimited = computed(() => (recentActivity.value || []).slice(0, 5))

onMounted(async () => {
  await fetchDashboardData()
})

async function fetchDashboardData() {
  try {
    const [statsResponse, chartsResponse, activityResponse] = await Promise.all([
      api.get('/dashboard/stats').catch(() => ({ data: getMockStats() })),
      api.get('/dashboard/charts').catch(() => ({ data: getMockChartData() })),
      api.get('/dashboard/activity').catch(() => ({ data: getMockActivity() }))
    ])

    stats.value = statsResponse.data
    chartData.value = chartsResponse.data
    normalizedCharts.value = normalizeChartData(chartsResponse.data)
    recentActivity.value = normalizeActivity(activityResponse.data)
    
    // Ensure we have valid chart data
    if (!normalizedCharts.value.aidRequests || Object.keys(normalizedCharts.value.aidRequests).length === 0) {
      console.log('No aid requests data, using mock data')
      normalizedCharts.value.aidRequests = getMockChartData().aidRequests
    }
    
    if (!normalizedCharts.value.distributions || Object.keys(normalizedCharts.value.distributions).length === 0) {
      console.log('No distributions data, using mock data')
      normalizedCharts.value.distributions = getMockChartData().distributions
    }
    
    // Debug logging
    console.log('Dashboard data loaded:', {
      stats: stats.value,
      chartData: chartData.value,
      normalizedCharts: normalizedCharts.value,
      aidRequestsData: normalizedCharts.value.aidRequests
    })
    if (!recentActivity.value || recentActivity.value.length === 0) {
      // Fallback to mock if API returned empty or unexpected shape
      recentActivity.value = getMockActivity()
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    // Fallback to mock data
    stats.value = getMockStats()
    chartData.value = getMockChartData()
    normalizedCharts.value = normalizeChartData(chartData.value)
    recentActivity.value = getMockActivity()
    
    console.log('Using fallback data:', {
      stats: stats.value,
      chartData: chartData.value,
      normalizedCharts: normalizedCharts.value
    })
    
    if (window.showToast) {
      window.showToast('warning', 'Notice', 'Using demo data - API connection failed')
    }
  }
}

// Mock data functions for demo purposes
function getMockStats() {
  return {
    beneficiaries: 1247,
    aid_requests: 89,
    distributions: 156,
    volunteers: 45
  }
}

function getMockChartData() {
  const mockData = {
    aidRequests: {
      'Pending': 23,
      'Approved': 45,
      'In Progress': 12,
      'Completed': 9
    },
    distributions: {
      'January': 45,
      'February': 52,
      'March': 38,
      'April': 61,
      'May': 48,
      'June': 55
    }
  }
  console.log('Mock chart data generated:', mockData)
  return mockData
}

function normalizeChartData(raw) {
  console.log('Normalizing chart data:', raw)
  
  const toObject = (input, keyCandidates = ['label', 'name', 'status', 'month'], valueCandidates = ['value', 'count', 'total']) => {
    if (!input) return {}
    // Already an object map
    if (typeof input === 'object' && !Array.isArray(input)) return input
    if (Array.isArray(input)) {
      const result = {}
      for (const item of input) {
        const key = keyCandidates.find(k => item && item[k] != null)
        const valKey = valueCandidates.find(k => item && item[k] != null)
        if (key && valKey) {
          result[item[key]] = Number(item[valKey]) || 0
        }
      }
      return result
    }
    return {}
  }

  const normalized = {
    aidRequests: toObject(raw?.aidRequests || raw?.aid_requests, ['label', 'name', 'status'], ['value', 'count', 'total']),
    distributions: toObject(raw?.distributions, ['label', 'name', 'month'], ['value', 'count', 'total'])
  }
  
  console.log('Normalized chart data:', normalized)
  return normalized
}

function getMockActivity() {
  return [
    {
      id: 1,
      description: 'New aid request submitted by John Doe',
      userInitials: 'JD',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      description: 'Distribution completed in District A',
      userInitials: 'SM',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      description: 'New volunteer registered: Sarah Wilson',
      userInitials: 'SW',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      description: 'Aid request approved for Maria Garcia',
      userInitials: 'MG',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  ]
}

function normalizeActivity(raw) {
  if (!raw) return []
  // If backend wraps in { data: [...] }
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : []
  return list.map((item, idx) => {
    const description = item.description || item.message || item.title || 'Activity'
    const createdAt = item.created_at || item.createdAt || item.timestamp || new Date().toISOString()
    const initials = item.userInitials || item.initials || deriveInitials(item.user_name || item.user || item.actor)
    return {
      id: item.id ?? idx,
      description,
      userInitials: initials || 'NA',
      created_at: createdAt
    }
  })
}

function deriveInitials(name) {
  if (!name || typeof name !== 'string') return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
</script>

<style scoped>
/* Page-scoped spacing for cards using CSS (requested) */
.dashboard-page .card {
  margin-bottom: 2rem; /* 32px */
}

@media (min-width: 1024px) {
  .dashboard-page .card {
    margin-bottom: 2.5rem; /* 40px */
  }
}
</style>