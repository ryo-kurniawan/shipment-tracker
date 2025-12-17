<script setup lang="ts">
/**
 * RealTimeToggle Component
 * Toggle switch for enabling/disabling real-time updates
 */
defineProps<{
  enabled: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 hover:shadow-xl transition-shadow duration-300"
  >
    <div class="flex items-center justify-between gap-4 mb-2">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="enabled ? 'bg-green-100' : 'bg-gray-100'"
        >
          <svg
            class="w-5 h-5"
            :class="enabled ? 'text-green-600' : 'text-gray-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <span class="text-sm font-semibold text-gray-900">Real-time Mode</span>
          <p class="text-xs text-gray-500">Auto status updates</p>
        </div>
      </div>
      <button
        @click="emit('toggle')"
        class="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="enabled ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'"
      >
        <span class="sr-only">Toggle real-time updates</span>
        <span
          class="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300"
          :class="enabled ? 'translate-x-8' : 'translate-x-1'"
        ></span>
      </button>
    </div>
  </div>
</template>
