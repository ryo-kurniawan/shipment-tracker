<script setup lang="ts">
import { computed } from 'vue'

/**
 * PaginationControls Component
 * Displays pagination buttons and page info
 */
const props = defineProps<{
  currentPage: number
  totalPages: number
  displayStart: number
  displayEnd: number
  totalResults: number
}>()

const emit = defineEmits<{
  goToPage: [page: number]
}>()

/**
 * Generate array of page numbers to display
 */
const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
  >
    <div class="text-sm text-gray-600">
      Showing {{ displayStart }} to {{ displayEnd }} of {{ totalResults }} results
    </div>

    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      <button
        @click="emit('goToPage', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-lg border transition-all duration-200"
        :class="
          currentPage === 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        "
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- First Page -->
      <button
        v-if="pageNumbers.length > 0 && pageNumbers[0]! > 1"
        @click="emit('goToPage', 1)"
        class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
      >
        1
      </button>
      <span v-if="pageNumbers.length > 0 && pageNumbers[0]! > 2" class="text-gray-400">...</span>

      <!-- Page Numbers -->
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="emit('goToPage', page)"
        class="px-4 py-2 rounded-lg border transition-all duration-200"
        :class="
          currentPage === page
            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        "
      >
        {{ page }}
      </button>

      <!-- Last Page -->
      <span
        v-if="pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1]! < totalPages - 1"
        class="text-gray-400"
        >...</span
      >
      <button
        v-if="pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1]! < totalPages"
        @click="emit('goToPage', totalPages)"
        class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
      >
        {{ totalPages }}
      </button>

      <!-- Next Button -->
      <button
        @click="emit('goToPage', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-lg border transition-all duration-200"
        :class="
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        "
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
