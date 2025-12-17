<script setup lang="ts">
/**
 * EmptyState Component
 * Displays when no items are found
 */
defineProps<{
  hasSearchQuery: boolean
  searchQuery?: string
}>()

const emit = defineEmits<{
  clearSearch: []
}>()
</script>

<template>
  <div class="text-center py-20">
    <div
      class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4"
    >
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      {{ hasSearchQuery ? 'No Matching Shipments' : 'No Shipments Found' }}
    </h3>
    <p class="text-gray-500">
      {{
        hasSearchQuery
          ? 'Try adjusting your search query'
          : 'There are currently no shipments to display'
      }}
    </p>
    <button
      v-if="hasSearchQuery"
      @click="emit('clearSearch')"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Clear Search
    </button>
  </div>
</template>
