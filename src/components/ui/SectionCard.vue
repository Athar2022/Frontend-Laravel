<template>
  <section :class="wrapperClasses">
    <header v-if="title || $slots.header" class="mb-4">
      <slot name="header">
        <h2 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
      </slot>
    </header>
    <div>
      <slot />
    </div>
    <footer v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  padding: { type: String, default: 'p-6' },
  hover: { type: Boolean, default: false },
  as: { type: String, default: 'section' }
})

const wrapperClasses = computed(() => [
  'card rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm',
  props.padding,
  props.hover ? 'hover:shadow-md transition-shadow duration-200' : ''
].join(' ').trim())
</script>


