<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" :class="{'dark': isDarkMode}">

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="loading-spinner h-12 w-12 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>

    <!-- Navigation -->
    <Navbar v-if="isAuthenticated && !isLoading" />

    <!-- Main Content -->
    <main v-if="!isLoading" class="min-h-screen">
      <!-- Content wrapper with proper spacing -->
      <div class="w-full">
        <router-view />
      </div>
    </main>

    <!-- Notifications -->
    <ToastNotifications />

    <!-- Back to top button -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title="Back to top"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>

    <!-- Debug Info (only in development) -->
    <div v-if="showDebugInfo && isDev" class="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div class="font-semibold mb-1">Debug Info:</div>
      <div>Auth: {{ isAuthenticated ? 'Yes' : 'No' }}</div>
      <div>Role: {{ user?.role || 'None' }}</div>
      <div>Dark Mode: {{ isDarkMode ? 'On' : 'Off' }}</div>
      <div>Route: {{ $route.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/layout/Navbar.vue'
import ToastNotifications from '@/components/ui/ToastNotifications.vue'

const route = useRoute()
const authStore = useAuthStore()
const isLoading = ref(true)
const showDebugInfo = ref(false) // Hidden by default; can be enabled via ?debug=1 in dev
const showBackToTop = ref(false)
const isDev = import.meta.env.DEV

// Dark mode handling
const isDark = useDark()
const toggleDark = useToggle(isDark)
const isDarkMode = computed(() => isDark.value)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user || {})

// التأكد من تحميل البيانات عند بدء التطبيق
onMounted(async () => {
  // Enable debug overlay only in development when query param is set
  try {
    const url = new URL(window.location.href)
    const debugParam = url.searchParams.get('debug')
    showDebugInfo.value = Boolean(isDev && debugParam === '1')
  } catch {}

  console.log('App mounted - Starting initialization...')

  // استدعاء initializeFromStorage
  authStore.initializeFromStorage();

  if (authStore.token) {
    console.log('Token found, fetching user data...')
    try {
      await authStore.fetchUser()
      console.log('User data fetched successfully:', authStore.user)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  } else {
    console.log('No token found, user is not authenticated')
  }

  isLoading.value = false
  console.log('App initialization completed')
})

// مراقبة تغييرات حالة المصادقة
watch(isAuthenticated, (newVal) => {
  console.log('Authentication state changed:', newVal)
  if (newVal) {
    console.log('User is authenticated, role:', user.value.role)
  }
})

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Handle scroll event for back to top button
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

// Monitor route changes
watch(route, (newRoute) => {
  console.log('Route changed:', newRoute.name)
})

// Add scroll listener on mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>