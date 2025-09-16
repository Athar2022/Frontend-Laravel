<template>
  <div :class="{'dark': isDarkMode}">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Navigation -->
      <Navbar v-if="isAuthenticated && !isLoading" />
      
      <!-- Main Content -->
      <main v-if="!isLoading">
        <router-view />
      </main>
      
      <!-- Notifications -->
      <ToastNotifications />
      
      <!-- Debug Info (يمكن إزالته في الإنتاج) -->
      <div v-if="showDebugInfo" class="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
        <div>Auth: {{ isAuthenticated ? 'Yes' : 'No' }}</div>
        <div>Role: {{ user?.role || 'None' }}</div>
        <div>Dark Mode: {{ isDarkMode ? 'On' : 'Off' }}</div>
        <div>Route: {{ $route.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/Navbar.vue'
import ToastNotifications from '@/components/ui/ToastNotifications.vue'

const route = useRoute()
const authStore = useAuthStore()
const isLoading = ref(true)
const showDebugInfo = ref(import.meta.env.DEV) // عرض معلومات التصحيح فقط في وضع التطوير

// Dark mode handling
const isDark = useDark()
const toggleDark = useToggle(isDark)
const isDarkMode = computed(() => isDark.value)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user || {})

// التأكد من تحميل بيانات المستخدم عند بدء التطبيق
onMounted(async () => {
  console.log('App mounted - Starting initialization...')
  
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

// مراقبة تغييرات المسار
watch(route, (newRoute) => {
  console.log('Route changed:', newRoute.name)
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