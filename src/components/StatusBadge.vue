<script setup lang="ts">
import type { Shipment } from '@/types/shipment'

/**
 * StatusBadge Component
 *
 * Displays a colored badge indicating the current status of a shipment.
 *
 * Color scheme:
 * - not-assigned: Yellow (waiting for action)
 * - assigned: Blue (transporter assigned)
 * - in-transit: Purple (actively moving)
 * - delivered: Green (completed successfully)
 * - cancelled: Red (terminated)
 */

defineProps<{
  /** The status to display */
  status: Shipment['status']
}>()

/** Human-readable labels for each status */
const statusLabels: Record<Shipment['status'], string> = {
  'not-assigned': 'Not Assigned',
  assigned: 'Assigned',
  'in-transit': 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset transition-all duration-200 hover:shadow-md"
    :class="{
      'bg-yellow-50 text-yellow-700 ring-yellow-600/20': status === 'not-assigned',
      'bg-blue-50 text-blue-700 ring-blue-600/20': status === 'assigned',
      'bg-purple-50 text-purple-700 ring-purple-600/20': status === 'in-transit',
      'bg-green-50 text-green-700 ring-green-600/20': status === 'delivered',
      'bg-red-50 text-red-700 ring-red-600/20': status === 'cancelled',
    }"
  >
    <!-- Status Icon -->
    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <!-- Not Assigned -->
      <path
        v-if="status === 'not-assigned'"
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clip-rule="evenodd"
      />
      <!-- Assigned -->
      <path
        v-else-if="status === 'assigned'"
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
        clip-rule="evenodd"
      />
      <!-- In Transit -->
      <path
        v-else-if="status === 'in-transit'"
        d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
      />
      <!-- Delivered -->
      <path
        v-else-if="status === 'delivered'"
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
      <!-- Cancelled -->
      <path
        v-else-if="status === 'cancelled'"
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"
      />
    </svg>
    <span>{{ statusLabels[status] }}</span>
  </span>
</template>
