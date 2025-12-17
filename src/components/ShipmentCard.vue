<script setup lang="ts">
import type { Shipment } from '@/types/shipment'
import StatusBadge from '@/components/StatusBadge.vue'
import { RouterLink } from 'vue-router'

/**
 * ShipmentCard Component
 *
 * Displays a summary card for a single shipment in the list view.
 *
 * Features:
 * - Shows shipment ID, origin, destination, and vehicle type
 * - Displays current status badge with color coding
 * - Provides link to detailed view
 * - Hover effect for better UX
 * - Responsive design with mobile-first approach
 */

defineProps<{
  /** The shipment data to display */
  shipment: Shipment
}>()
</script>

<template>
  <div
    class="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
  >
    <!-- Card Header with Gradient -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white">{{ shipment.id }}</h3>
        </div>
        <StatusBadge :status="shipment.status" />
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6">
      <div class="space-y-3 mb-5">
        <!-- Origin -->
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">From</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ shipment.origin }}</p>
          </div>
        </div>

        <!-- Destination -->
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">To</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ shipment.destination }}</p>
          </div>
        </div>

        <!-- Vehicle Type -->
        <div
          class="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-100"
        >
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500">Vehicle Type</p>
            <p class="text-sm font-bold text-gray-900">{{ shipment.vehicleType }}</p>
          </div>
        </div>
      </div>

      <!-- View Details Button -->
      <RouterLink
        :to="`/shipments/${shipment.id}`"
        class="group/btn relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
      >
        <span class="relative z-10 flex items-center gap-2">
          View Details
          <svg
            class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"
        ></div>
      </RouterLink>
    </div>
  </div>
</template>
