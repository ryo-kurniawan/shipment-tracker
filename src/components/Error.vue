<script setup lang="ts">
/**
 * ErrorState Component
 * Displays an error message with icon
 */
defineProps<{
  title?: string
  message: string
}>()
</script>

<template>
  <div
    class="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md"
  >
    <div class="flex items-start gap-3">
      <svg
        class="w-6 h-6 text-red-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 class="text-red-900 font-semibold text-lg">{{ title || 'Error' }}</h3>
        <p class="text-red-700 mt-1">{{ message }}</p>
      </div>
    </div>
  </div>
</template>
