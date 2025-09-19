<template>
  <nav class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link :to="{ name: 'Home' }" class="text-xl font-bold text-blue-600 dark:text-blue-400">
              Humanitarian Aid
            </router-link>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="[
                $route.name === item.name
                  ? 'border-blue-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
        
        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg
              v-if="isDarkMode"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
          
          <!-- Notifications Bell -->
          <router-link
            :to="{ name: 'Notifications' }"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative transition-colors duration-200"
            title="Notifications"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            >
              {{ unreadNotifications }}
            </span>
          </router-link>
          
          <!-- Profile Dropdown -->
          <div class="relative ml-3">
            <div class="flex items-center space-x-3">
              <span class="hidden md:inline text-sm text-gray-700 dark:text-gray-300">
                {{ user.name }}
              </span>
              <div class="relative">
                <button
                  @click="isProfileMenuOpen = !isProfileMenuOpen"
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                  >
                    {{ userInitials }}
                  </div>
                </button>
                
                <!-- Dropdown Menu -->
                <div
                  v-if="isProfileMenuOpen"
                  v-click-outside="closeProfileMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-50"
                >
                  <router-link
                    :to="{ name: 'Profile' }"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    @click="closeProfileMenu"
                  >
                    Your Profile
                  </router-link>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    @click="logout"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu button -->
    <div class="sm:hidden">
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="block h-6 w-6"
          :class="{ 'hidden': isMobileMenuOpen, 'block': !isMobileMenuOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          class="block h-6 w-6"
          :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="[
            $route.name === item.name
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          ]"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()
const isProfileMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const unreadNotifications = ref(0)

// Dark mode handling
const isDark = useDark()
const toggleDark = useToggle(isDark)

const isDarkMode = computed(() => isDark.value)
const user = computed(() => authStore.user || {})
const userInitials = computed(() => {
  if (!user.value.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const navigation = computed(() => {
  const baseRoutes = [
    { name: 'Dashboard', to: { name: 'Dashboard' } },
    { name: 'Aid Requests', to: { name: 'AidRequests' } }
  ]

  if (['admin', 'volunteer'].includes(user.value.role)) {
    baseRoutes.push({ name: 'Distributions', to: { name: 'Distributions' } })
  }

 if (user.value.role === 'admin') {
    baseRoutes.push(
      { name: 'Donations', to: { name: 'Donations' } },
      { name: 'Beneficiaries', to: { name: 'Beneficiaries' } },
      { name: 'Volunteers', to: { name: 'Volunteers' } },
      { name: 'Users', to: { name: 'Users' } }
    )
  }

  return baseRoutes
})

function toggleDarkMode() {
  toggleDark()
  console.log('Dark mode toggled:', isDarkMode.value)
}

function closeProfileMenu() {
  isProfileMenuOpen.value = false
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function logout() {
  closeProfileMenu()
  authStore.logout()
  router.push({ name: 'Login' })
  console.log('User logged out')
}

// Directive for clicking outside
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Fetch notifications count
onMounted(async () => {
  try {
    // سيتم تنفيذ هذا عندما تكون واجهة API جاهزة
    // const response = await api.get('/notifications/unread-count')
    // unreadNotifications.value = response.data.count
    unreadNotifications.value = 3 // قيمة تجريبية
  } catch (error) {
    console.error('Failed to fetch notifications count:', error)
  }
})

// إغلاق القوائم المنسدلة عند تغيير المسار
const unwatch = router.afterEach(() => {
  isProfileMenuOpen.value = false
  isMobileMenuOpen.value = false
})

onUnmounted(() => {
  unwatch()
})
</script>