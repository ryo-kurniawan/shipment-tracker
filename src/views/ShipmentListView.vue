<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useShipmentStore } from '@/stores/shipmentStore'
import ShipmentCard from '@/components/ShipmentCard.vue'
import StatusUpdateNotification from '@/components/StatusUpdateNotification.vue'

/**
 * ShipmentListView Component
 *
 * Displays a grid of all shipments with the following features:
 * - Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
 * - Real-time status update toggle (off by default)
 * - Loading and error states
 * - Toast notifications for status changes when real-time is enabled
 */

const shipmentStore = useShipmentStore()

/** Controls whether real-time updates are enabled (default: off) */
const realTimeEnabled = ref(false)

// Lifecycle: Fetch shipments when component mounts
onMounted(() => {
  shipmentStore.fetchShipments()
})

// Lifecycle: Clean up real-time updates when component unmounts
onUnmounted(() => {
  shipmentStore.stopRealTimeUpdates()
})

/**
 * Toggle real-time status updates on/off
 * When enabled, shipment statuses will update automatically every 5 seconds
 */
function toggleRealTime() {
  realTimeEnabled.value = !realTimeEnabled.value
  if (realTimeEnabled.value) {
    shipmentStore.startRealTimeUpdates()
  } else {
    shipmentStore.stopRealTimeUpdates()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-10">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
            <div
              v-if="realTimeEnabled"
              class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 w-fit"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-blue-700 font-medium">Live updates every 5 seconds</span>
            </div>
          </div>

          <!-- Real-time Updates Toggle -->
          <div
            class="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center justify-between gap-4 mb-2">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center"
                  :class="realTimeEnabled ? 'bg-green-100' : 'bg-gray-100'"
                >
                  <svg
                    class="w-5 h-5"
                    :class="realTimeEnabled ? 'text-green-600' : 'text-gray-500'"
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
                @click="toggleRealTime"
                class="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="
                  realTimeEnabled
                    ? 'bg-green-500 focus:ring-green-500'
                    : 'bg-gray-300 focus:ring-gray-400'
                "
              >
                <span class="sr-only">Toggle real-time updates</span>
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300"
                  :class="realTimeEnabled ? 'translate-x-8' : 'translate-x-1'"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="shipmentStore.loading" class="flex flex-col justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"
          ></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading shipments...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="shipmentStore.error"
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
            <h3 class="text-red-900 font-semibold text-lg">Error Loading Shipments</h3>
            <p class="text-red-700 mt-1">{{ shipmentStore.error }}</p>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShipmentCard
          v-for="shipment in shipmentStore.shipments"
          :key="shipment.id"
          :shipment="shipment"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="!shipmentStore.loading && shipmentStore.shipments.length === 0"
        class="text-center py-20"
      >
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Shipments Found</h3>
        <p class="text-gray-500">There are currently no shipments to display</p>
      </div>
    </div>

    <!-- Status Update Notifications -->
    <StatusUpdateNotification v-if="realTimeEnabled" />
  </div>
</template>
