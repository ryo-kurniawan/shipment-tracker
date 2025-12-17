<script setup lang="ts">
/**
 * PageHeader Component
 * Displays the page title, icon, and status indicators
 */
defineProps<{
  realTimeEnabled: boolean
  useServerSide: boolean
}>()
</script>

<template>
  <div class="mb-10 mt-5">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent"
            >
              Shipment Tracker
            </h1>
            <p class="mt-1 text-gray-600 font-medium">Manage and track all your shipments</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            v-if="realTimeEnabled"
            class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-blue-700 font-medium">Live updates every 5 seconds</span>
          </div>
          <div
            v-if="useServerSide"
            class="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2"
          >
            <svg
              class="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
            <span class="text-sm text-purple-700 font-medium">Server-side mode</span>
          </div>
        </div>
      </div>

      <slot name="toggle"></slot>
    </div>
  </div>
</template>
