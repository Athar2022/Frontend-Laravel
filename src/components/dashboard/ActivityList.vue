<template>
  <div class="space-y-4">
    <div v-for="activity in activities" :key="activity.id" class="flex items-center space-x-3">
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

    <div v-if="!activities || activities.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activities: { type: Array, default: () => [] }
})

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


