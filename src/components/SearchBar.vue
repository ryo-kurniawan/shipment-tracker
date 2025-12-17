<script setup lang="ts">
/**
 * SearchBar Component
 * Search input with clear button and results count
 */
const props = defineProps<{
  modelValue: string
  totalResults?: number
  showResultsCount?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: []
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input')
}

function clearSearch() {
  emit('update:modelValue', '')
  emit('input')
}
</script>

<template>
  <div class="mb-6">
    <div class="relative max-w-2xl">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        type="text"
        placeholder="Search by origin or destination"
        class="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
      />
      <div v-if="modelValue" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <button @click="clearSearch" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    <p
      v-if="modelValue && showResultsCount && totalResults !== undefined"
      class="mt-2 text-sm text-gray-600"
    >
      Found {{ totalResults }} shipment{{ totalResults !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
