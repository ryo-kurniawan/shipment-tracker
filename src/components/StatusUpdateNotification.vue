<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useShipmentStore } from '@/stores/shipmentStore'
import type { Notification } from '@/types/notification'

/**
 * StatusUpdateNotification Component
 *
 * Displays toast notifications when shipment statuses change during real-time updates.
 *
 * Features:
 * - Tracks previous status for each shipment
 * - Shows animated toast notifications on status changes
 * - Auto-dismisses notifications after 5 seconds
 * - Positioned in top-right corner with slide-in animation
 * - Supports multiple simultaneous notifications
 */

const shipmentStore = useShipmentStore()

/** Array of active notifications */
const notifications = ref<Notification[]>([])

/** Map to track previous status of each shipment for change detection */
const previousStatuses = ref(new Map<string, string>())

/**
 * Initialize previous statuses map on component mount
 * This establishes a baseline for detecting future changes
 */
onMounted(() => {
  shipmentStore.shipments.forEach((shipment) => {
    previousStatuses.value.set(shipment.id, shipment.status)
  })
})

/**
 * Watch for shipment status changes
 *
 * When a shipment's status changes:
 * 1. Detects the change by comparing with previous status
 * 2. Creates a notification showing the transition (old → new)
 * 3. Adds notification to the display queue
 * 4. Auto-removes the notification after 5 seconds
 * 5. Updates the previous status for future comparisons
 */
watch(
  () => shipmentStore.shipments,
  (newShipments) => {
    newShipments.forEach((shipment) => {
      const prevStatus = previousStatuses.value.get(shipment.id)

      // Check if status has changed
      if (prevStatus && prevStatus !== shipment.status) {
        const notification: Notification = {
          id: `${shipment.id}-${Date.now()}`,
          message: `Shipment ${shipment.id}: ${prevStatus} → ${shipment.status}`,
          timestamp: Date.now(),
        }

        notifications.value.push(notification)

        // Schedule auto-removal after 5 seconds
        setTimeout(() => {
          notifications.value = notifications.value.filter((n) => n.id !== notification.id)
        }, 5000)
      }

      // Update tracking map with current status
      previousStatuses.value.set(shipment.id, shipment.status)
    })
  },
  { deep: true }, // Deep watch to detect nested property changes
)
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-4 border border-blue-400/20 backdrop-blur-sm"
      >
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg
              class="w-5 h-5 animate-pulse"
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
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm font-bold">Status Update</p>
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <p class="text-sm opacity-95 font-medium">{{ notification.message }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
