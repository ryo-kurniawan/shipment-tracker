<script setup lang="ts">
/**
 * Loading Component
 * Displays a loading spinner with message
 */
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center py-20">
    <div class="relative">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
      <div
        class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"
      ></div>
    </div>
    <p class="mt-4 text-gray-600 font-medium">{{ message || 'Loading...' }}</p>
  </div>
</template>
