<template>
  <nav class="bg-white shadow-lg border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <router-link
            :to="{ name: 'Dashboard' }"
            class="flex items-center space-x-3 text-2xl font-bold tracking-wide text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <img 
                src="@/assets/icon.png" 
                alt="Humanitarian Aid Logo" 
                class="w-6 h-6 object-contain"
              />
            </div>
            <span>Humanitarian Aid</span>
          </router-link>

          <!-- Navigation Links -->
          <div class="hidden lg:flex lg:space-x-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="[
                $route.name === item.name
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
              ]"
            >
              {{ item.name }}
              <div
                v-if="$route.name === item.name"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
              ></div>
            </router-link>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-3 right-actions">
          <!-- Mobile menu button -->
            <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
            :class="{ 'bg-gray-100 dark:bg-gray-800': isMobileMenuOpen }"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Dark mode toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-all duration-200"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg
              v-if="isDarkMode"
              class="h-5 w-5"
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
              class="h-5 w-5"
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

          <!-- Notifications -->
          <router-link
            :to="{ name: 'Notifications' }"
            class="relative p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-all duration-200"
            title="Notifications"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full"
            >
              {{ unreadNotifications }}
            </span>
          </router-link>

          <!-- User menu -->
          <div class="relative" @mouseenter="openProfileMenu" @mouseleave="closeProfileMenu">
            <button
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 user-trigger"
            >
              <div class="text-right hidden sm:block user-text">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ user.role }}</p>
              </div>
              <div
                class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white dark:ring-gray-800"
              >
                {{ userInitials }}
              </div>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="isProfileMenuOpen"
              v-click-outside="closeProfileMenu"
              class="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/10 dark:bg-gray-800 dark:ring-gray-700 z-50 overflow-hidden"
            >
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
              <div class="py-1">
                <router-link
                  :to="{ name: 'Profile' }"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  @click="closeProfileMenu"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Profile
                </router-link>
                <button
                  type="button"
                  class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  @click="logout"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div v-show="isMobileMenuOpen" class="px-4 py-2 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
          :class="[
            $route.name === item.name
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          ]"
          @click="isMobileMenuOpen = false"
        >
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useDark, useToggle } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const isProfileMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Dark mode handling
const isDark = useDark()
const toggleDark = useToggle(isDark)

const isDarkMode = computed(() => isDark.value)
const user = computed(() => authStore.user || {})
const unreadNotifications = computed(() => notificationStore.unreadCount || 0)
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
      // { name: 'Beneficiaries', to: { name: 'Beneficiaries' } },
      // { name: 'Volunteers', to: { name: 'Volunteers' } },
      { name: 'Users', to: { name: 'Users' } }
    )
  }

  return baseRoutes
})

function toggleDarkMode() {
  toggleDark()
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  console.log('Dark mode toggled:', isDarkMode.value)
}

function closeProfileMenu() {
  isProfileMenuOpen.value = false
}

function openProfileMenu() {
  isProfileMenuOpen.value = true
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
    await notificationStore.fetchUnreadCount()
  } catch (error) {
    console.error('Failed to fetch notifications count:', error)
    // Set fallback data if API fails
    notificationStore.unreadCount = 3
  }
})

// Watch for changes in notifications and update count
watch(() => notificationStore.notifications, () => {
  notificationStore.updateUnreadCount()
}, { deep: true })

// إغلاق القوائم المنسدلة عند تغيير المسار
const unwatch = router.afterEach(() => {
  isProfileMenuOpen.value = false
  isMobileMenuOpen.value = false
})

onUnmounted(() => {
  unwatch()
})
</script>

<style scoped>
/* Normalize navbar container and avoid visual overlap */
nav {
  position: sticky;
  top: 0;
  z-index: 40;
}

/* Ensure consistent height and alignment */
.flex.justify-between.h-16 {
  min-height: 64px; /* h-16 = 64px */
  align-items: center;
}

/* Tighter, consistent spacing between left cluster (logo + links) */
.flex.items-center.space-x-8 {
  column-gap: 1.5rem; /* ~ space-x-6 visually */
}

/* Keep brand text on one line to avoid wrapping */
nav a[aria-current],
nav a.router-link-active,
nav a.router-link-exact-active {
  white-space: nowrap;
}

/* Improve dropdown/menu stacking */
.relative > .absolute {
  z-index: 50;
}

/* Right side actions layout tuning */
.right-actions {
  gap: 0.75rem; /* base gap */
}

.right-actions > * {
  flex-shrink: 0; /* prevent icons/buttons from shrinking */
}

.user-trigger {
  max-width: 220px; /* constrain user area to avoid overflow */
}

.user-text {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .right-actions { gap: 0.875rem; }
  .user-trigger { max-width: 260px; }
  .user-text { max-width: 170px; }
}

@media (min-width: 1024px) {
  .right-actions { gap: 1rem; }
  .user-text { max-width: 200px; }
}

/* Mobile menu: overlay neatly under the navbar instead of collapsing content */
nav > .lg\:hidden {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 30;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* Reset positioning on large screens (menu hidden anyway) */
@media (min-width: 1024px) {
  nav > .lg\:hidden {
    position: static;
    box-shadow: none;
  }
}

/* Better touch target spacing on small screens */
@media (max-width: 639.98px) {
  .px-4.py-3.rounded-lg.text-base.font-medium.transition-colors.duration-200 {
    padding-top: 0.875rem;  /* 14px */
    padding-bottom: 0.875rem;
  }
}
</style>