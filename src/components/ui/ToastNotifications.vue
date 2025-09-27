<template>
  <div
    class="fixed inset-x-0 top-0 z-40 flex flex-col items-center pointer-events-none space-y-2 p-4"
    aria-live="polite"
    aria-atomic="true"
  >
    <transition-group name="toast" tag="div" class="w-full max-w-md space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-lg shadow ring-1 ring-black/5 p-3"
        :class="toastClass(toast.type)"
        role="status"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium">{{ toast.title }}</p>
          <p v-if="toast.message" class="text-sm opacity-80">{{ toast.message }}</p>
        </div>
        <button
          @click="dismiss(toast.id)"
          class="shrink-0 rounded p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="closeClass(toast.type)"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let idCounter = 0

function push(type, title, message, duration = 3000) {
  const id = ++idCounter
  toasts.value.push({ id, type, title, message })
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
}

function dismiss(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function toastClass(type) {
  const base = 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100'
  const map = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
    warning: 'border-l-4 border-yellow-500'
  }
  return `${base} ${map[type] || ''}`
}

function closeClass(type) {
  const map = {
    success: 'focus:ring-green-500',
    error: 'focus:ring-red-500',
    info: 'focus:ring-blue-500',
    warning: 'focus:ring-yellow-500'
  }
  return map[type] || 'focus:ring-gray-400'
}

function registerGlobal() {
  window.showToast = (type, title, message, duration) => {
    push(type, title, message, duration)
  }
}

function unregisterGlobal() {
  if (window.showToast) {
    delete window.showToast
  }
}

onMounted(registerGlobal)
onUnmounted(unregisterGlobal)
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all .2s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-10px); }
.toast-leave-to { opacity: 0; transform: translateY(-10px); }
</style>