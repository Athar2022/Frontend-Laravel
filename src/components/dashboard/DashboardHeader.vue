<template>
  <header class="mb-8 animate-fade-in-up">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h1>
    <p v-if="subtitle" class="text-lg text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>


