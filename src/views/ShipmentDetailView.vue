<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShipmentStore } from '@/stores/shipmentStore'
import StatusBadge from '@/components/StatusBadge.vue'

/**
 * ShipmentDetailView Component
 *
 * Displays detailed information about a single shipment with the following features:
 * - View shipment details (origin, destination, route, vehicle type, status)
 * - Assign transporter to unassigned shipments
 * - Re-assign transporter to assigned shipments
 * - Prevent assignment/re-assignment for in-transit, delivered, or cancelled shipments
 * - Vehicle type matching validation
 * - Transporter availability validation (prevents double-booking)
 * - Success/error feedback messages
 */

const route = useRoute()
const router = useRouter()
const shipmentStore = useShipmentStore()

// UI state
/** Currently selected transporter ID from dropdown */
const selectedTransporterId = ref('')

/** Show success message after successful assignment */
const showSuccess = ref(false)

/** Show error message after failed assignment */
const showError = ref(false)

/** Client-side validation error message */
const validationError = ref('')

/** Server-side error message */
const errorMessage = ref('')

/**
 * Get transporters compatible with the current shipment
 *
 * Filters transporters based on two criteria:
 * 1. Vehicle type must match the shipment's required vehicle type
 * 2. Transporter must be available (not assigned to another shipment)
 *
 * @returns Array of compatible and available transporters
 */
const compatibleTransporters = computed(() => {
  if (!shipmentStore.currentShipment) return []

  return shipmentStore.transporters.filter((transporter) => {
    const hasMatchingVehicle =
      transporter.vehicleType === shipmentStore.currentShipment?.vehicleType
    const isAvailable = shipmentStore.isTransporterAvailable(
      transporter.id,
      shipmentStore.currentShipment?.id,
    )
    return hasMatchingVehicle && isAvailable
  })
})

/**
 * Get transporters available for re-assignment
 *
 * For re-assignment scenarios, excludes the currently assigned transporter
 * to prevent "re-assigning" the same transporter.
 *
 * @returns Array of compatible transporters excluding current assignment
 */
const availableForReassignment = computed(() => {
  if (!shipmentStore.currentShipment) return []

  return compatibleTransporters.value.filter(
    (transporter) => transporter.id !== shipmentStore.currentShipment?.transporterId,
  )
})

/**
 * Get transporters that match vehicle type but are unavailable
 *
 * Used to display informative messages to users about why certain
 * transporters cannot be selected (already assigned elsewhere).
 *
 * @returns Array of matching but unavailable transporters
 */
const unavailableTransporters = computed(() => {
  if (!shipmentStore.currentShipment) return []

  return shipmentStore.transporters.filter((transporter) => {
    const hasMatchingVehicle =
      transporter.vehicleType === shipmentStore.currentShipment?.vehicleType
    const isUnavailable = !shipmentStore.isTransporterAvailable(
      transporter.id,
      shipmentStore.currentShipment?.id,
    )
    return hasMatchingVehicle && isUnavailable
  })
})

// Lifecycle: Load shipment data and transporters when component mounts
onMounted(async () => {
  const id = route.params.id as string

  // Ensure shipments list is loaded (required for real-time updates to work correctly)
  if (shipmentStore.shipments.length === 0) {
    await shipmentStore.fetchShipments()
  }

  // Fetch shipment details and transporters in parallel for better performance
  await Promise.all([shipmentStore.fetchShipmentById(id), shipmentStore.fetchTransporters()])

  // Pre-select current transporter if one is already assigned
  if (shipmentStore.currentShipment?.transporterId) {
    selectedTransporterId.value = shipmentStore.currentShipment.transporterId
  }
})

/**
 * Handle transporter assignment or re-assignment
 *
 * Validates that a transporter is selected, then calls the store action.
 * Shows success or error feedback based on the result.
 *
 * Success messages auto-hide after 3 seconds
 * Error messages auto-hide after 5 seconds
 */
async function handleAssign() {
  // Clear previous messages
  validationError.value = ''
  errorMessage.value = ''

  // Validate transporter selection
  if (!selectedTransporterId.value) {
    validationError.value = 'Please select a transporter'
    return
  }

  const id = route.params.id as string
  const result = await shipmentStore.assignTransporterToShipment(id, selectedTransporterId.value)

  if (result.success) {
    // Show success message and auto-hide after 3 seconds
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } else {
    // Show error message and auto-hide after 5 seconds
    showError.value = true
    errorMessage.value = result.error || 'Failed to assign transporter'
    setTimeout(() => {
      showError.value = false
      errorMessage.value = ''
    }, 5000)
  }
}

/**
 * Navigate back to the shipments list view
 */
function goBack() {
  router.push('/shipments')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="group mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <svg
          class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Shipments
      </button>

      <!-- Loading State -->
      <div v-if="shipmentStore.loading" class="flex flex-col justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"
          ></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading shipment details...</p>
      </div>

      <!-- Shipment Details -->
      <div
        v-else-if="shipmentStore.currentShipment"
        class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <!-- Header with Gradient -->
        <div
          class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-8 h-8 text-white"
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
                  <p class="text-blue-100 text-sm font-medium">Shipment ID</p>
                  <h1 class="text-3xl font-bold text-white">
                    {{ shipmentStore.currentShipment.id }}
                  </h1>
                </div>
              </div>
              <StatusBadge :status="shipmentStore.currentShipment.status" />
            </div>
          </div>
          <!-- Decorative elements -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
          ></div>
        </div>

        <!-- Details -->
        <div class="p-8 space-y-6">
          <!-- Location Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Origin Card -->
            <div
              class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-white"
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
                  <h3 class="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                    Origin
                  </h3>
                  <p class="text-lg font-bold text-gray-900">
                    {{ shipmentStore.currentShipment.origin }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Destination Card -->
            <div
              class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100 shadow-sm"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-white"
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
                  <h3 class="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">
                    Destination
                  </h3>
                  <p class="text-lg font-bold text-gray-900">
                    {{ shipmentStore.currentShipment.destination }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Route Card -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                  Route
                </h3>
                <p class="text-lg font-bold text-gray-900">
                  {{ shipmentStore.currentShipment.route }}
                </p>
              </div>
            </div>
          </div>

          <!-- Vehicle Type Card -->
          <div
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
                  Vehicle Type
                </h3>
                <p class="text-lg font-bold text-gray-900">
                  {{ shipmentStore.currentShipment.vehicleType }}
                </p>
              </div>
            </div>
          </div>

          <!-- Current Transporter Card -->
          <div
            v-if="shipmentStore.currentShipment.transporterId"
            class="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-indigo-100 shadow-md"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  Current Transporter
                </h3>
                <p class="text-sm text-indigo-600">Assigned to this shipment</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Name</p>
                  <p class="text-base font-bold text-gray-900">
                    {{
                      shipmentStore.getTransporterById(shipmentStore.currentShipment.transporterId)
                        ?.name || 'Unknown'
                    }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{
                      shipmentStore.getTransporterById(shipmentStore.currentShipment.transporterId)
                        ?.email
                    }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Phone</p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{
                      shipmentStore.getTransporterById(shipmentStore.currentShipment.transporterId)
                        ?.phone
                    }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Vehicle Type</p>
                  <p class="text-sm font-bold text-indigo-600">
                    {{
                      shipmentStore.getTransporterById(shipmentStore.currentShipment.transporterId)
                        ?.vehicleType
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div
            v-if="showSuccess"
            class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-5 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-green-900 font-semibold">Success!</h4>
                <p class="text-green-700 text-sm">Transporter assigned successfully</p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="showError"
            class="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-5 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-red-900 font-semibold">Error</h4>
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Assignment Form -->
          <div v-if="shipmentStore.currentShipment.status === 'not-assigned'" class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Assign Transporter</h3>

            <div class="space-y-4">
              <div>
                <label for="transporter" class="block text-sm font-medium text-gray-700 mb-2">
                  Select Transporter (matching {{ shipmentStore.currentShipment.vehicleType }})
                </label>
                <select
                  id="transporter"
                  v-model="selectedTransporterId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': validationError }"
                >
                  <option value="">-- Select a transporter --</option>
                  <option
                    v-for="transporter in compatibleTransporters"
                    :key="transporter.id"
                    :value="transporter.id"
                  >
                    {{ transporter.name }} ({{ transporter.vehicleType }})
                  </option>
                </select>
                <p v-if="validationError" class="mt-1 text-sm text-red-600">
                  {{ validationError }}
                </p>
                <p
                  v-if="compatibleTransporters.length === 0 && unavailableTransporters.length > 0"
                  class="mt-2 text-sm text-amber-600"
                >
                  All {{ shipmentStore.currentShipment.vehicleType }} transporters are currently
                  assigned to other shipments
                </p>
                <p
                  v-else-if="compatibleTransporters.length === 0"
                  class="mt-2 text-sm text-amber-600"
                >
                  No transporters available with {{ shipmentStore.currentShipment.vehicleType }}
                </p>

                <!-- Show unavailable transporters info -->
                <div
                  v-if="unavailableTransporters.length > 0"
                  class="mt-3 p-3 bg-gray-50 rounded-md"
                >
                  <p class="text-xs font-medium text-gray-700 mb-1">
                    Already assigned transporters:
                  </p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="t in unavailableTransporters" :key="t.id">
                      • {{ t.name }} ({{ t.vehicleType }}) - Currently unavailable
                    </li>
                  </ul>
                </div>
              </div>

              <button
                @click="handleAssign"
                :disabled="shipmentStore.loading || compatibleTransporters.length === 0"
                class="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ shipmentStore.loading ? 'Assigning...' : 'Assign Transporter' }}
              </button>
            </div>
          </div>

          <!-- Re-assign Option for Assigned Shipments (but not in-transit or delivered) -->
          <div
            v-else-if="shipmentStore.currentShipment.status === 'assigned'"
            class="border-t pt-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Re-assign Transporter</h3>

            <!-- Show message if no transporters available -->
            <div
              v-if="availableForReassignment.length === 0"
              class="bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
              <p class="text-amber-800 font-medium">Cannot re-assign transporter</p>
              <p class="text-amber-700 text-sm mt-1">
                No other transporters with {{ shipmentStore.currentShipment.vehicleType }} are
                available. All matching transporters are currently assigned to other shipments.
              </p>
            </div>

            <div v-else class="space-y-4">
              <div>
                <label
                  for="transporter-reassign"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select New Transporter (matching {{ shipmentStore.currentShipment.vehicleType }})
                </label>
                <select
                  id="transporter-reassign"
                  v-model="selectedTransporterId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': validationError }"
                >
                  <option value="">-- Select a different transporter --</option>
                  <option
                    v-for="transporter in availableForReassignment"
                    :key="transporter.id"
                    :value="transporter.id"
                  >
                    {{ transporter.name }} ({{ transporter.vehicleType }})
                  </option>
                </select>
                <p v-if="validationError" class="mt-1 text-sm text-red-600">
                  {{ validationError }}
                </p>

                <!-- Show unavailable transporters info -->
                <div
                  v-if="unavailableTransporters.length > 0"
                  class="mt-3 p-3 bg-gray-50 rounded-md"
                >
                  <p class="text-xs font-medium text-gray-700 mb-1">
                    Already assigned transporters:
                  </p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="t in unavailableTransporters" :key="t.id">
                      • {{ t.name }} ({{ t.vehicleType }}) - Currently unavailable
                    </li>
                  </ul>
                </div>
              </div>

              <button
                @click="handleAssign"
                :disabled="shipmentStore.loading"
                class="w-full px-6 py-3 text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ shipmentStore.loading ? 'Re-assigning...' : 'Re-assign Transporter' }}
              </button>
            </div>
          </div>

          <!-- Message for shipments that cannot be reassigned -->
          <div
            v-else-if="
              ['in-transit', 'delivered', 'cancelled'].includes(
                shipmentStore.currentShipment.status,
              )
            "
            class="border-t pt-6"
          >
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-gray-800 font-medium">Transporter Assignment Locked</p>
              <p class="text-gray-600 text-sm mt-1">
                Cannot assign or re-assign transporter for shipments with status:
                <span class="font-semibold">{{ shipmentStore.currentShipment.status }}</span>
              </p>
              <p class="text-gray-500 text-xs mt-2">
                Transporter assignment is only available for shipments with "not-assigned" or
                "assigned" status.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500">Shipment not found</p>
      </div>
    </div>
  </div>
</template>
