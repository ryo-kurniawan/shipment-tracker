import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useShipmentApi } from '@/composables/useShipmentApi'

/**
 * Shipment Store (Refactored with API Composable)
 *
 * Manages the state for shipments and transporters in the application.
 * Handles CRUD operations, real-time updates, and business logic for transporter assignments.
 *
 * Features:
 * - Fetch and manage shipments list with pagination and search
 * - Assign/re-assign transporters to shipments
 * - Real-time status update simulation
 * - Validation for vehicle type matching and transporter availability
 * - Server-side pagination support (optional)
 * - Server-side search support (optional)
 * - Separation of concerns: API logic moved to composable
 */
export const useShipmentStore = defineStore('shipment', () => {
  // ==================== API Composable ====================
  const shipmentApi = useShipmentApi()

  // ==================== State ====================

  /** List of all shipments (current page or all if client-side) */
  const shipments = ref<Shipment[]>([])

  /** Currently selected/viewed shipment */
  const currentShipment = ref<Shipment | null>(null)

  /** List of all available transporters */
  const transporters = ref<Transporter[]>([])

  /** Loading state for async operations */
  const loading = ref(false)

  /** Error message from failed operations */
  const error = ref<string | null>(null)

  /** Total count of shipments (for server-side pagination) */
  const totalShipments = ref(0)

  /** Current page number (for server-side pagination) */
  const currentPage = ref(1)

  /** Items per page (for server-side pagination) */
  const itemsPerPage = ref(9)

  /** Current search query (for server-side search) */
  const searchQuery = ref('')

  // ==================== Getters ====================

  /** Get all shipments with 'assigned' status */
  const assignedShipments = computed(() =>
    shipments.value.filter((shipment) => shipment.status === 'assigned'),
  )

  /** Get all shipments with 'not-assigned' status */
  const notAssignedShipments = computed(() =>
    shipments.value.filter((shipment) => shipment.status === 'not-assigned'),
  )

  /** Calculate total pages (for server-side pagination) */
  const totalPages = computed(() => Math.ceil(totalShipments.value / itemsPerPage.value))

  /**
   * Get transporter by ID
   * @param id - Transporter ID
   * @returns Transporter object or undefined
   */
  const getTransporterById = computed(
    () => (id: string) => transporters.value.find((transporter) => transporter.id === id),
  )

  /**
   * Get list of transporter IDs that are currently assigned to shipments
   * Includes transporters with 'assigned' or 'in-transit' status (actively working)
   */
  const assignedTransporterIds = computed(() =>
    shipments.value
      .filter((s) => s.transporterId && (s.status === 'assigned' || s.status === 'in-transit'))
      .map((s) => s.transporterId as string),
  )

  /**
   * Check if a transporter is available for assignment
   * A transporter is unavailable if assigned to or actively transporting another shipment
   *
   * Business rule: Transporters with 'assigned' or 'in-transit' status are blocked
   * until the shipment is delivered or cancelled
   *
   * @param transporterId - The ID of the transporter to check
   * @param currentShipmentId - Optional shipment ID to exclude (for re-assignment)
   * @returns true if available, false if already assigned/in-transit on another shipment
   */
  const isTransporterAvailable = computed(
    () => (transporterId: string, currentShipmentId?: string) => {
      const busyShipment = shipments.value.find(
        (s) =>
          s.transporterId === transporterId &&
          (s.status === 'assigned' || s.status === 'in-transit') &&
          s.id !== currentShipmentId, // Exclude current shipment for re-assignment
      )
      // Available if not busy (assigned/in-transit on another shipment)
      return !busyShipment
    },
  )

  // ==================== Actions ====================

  /**
   * Fetch all shipments from the API (with optional pagination and search)
   * Updates the shipments state with the fetched data
   *
   * @param options - Optional pagination and search parameters
   * @param options.page - Page number (1-indexed)
   * @param options.limit - Items per page
   * @param options.search - Search query for origin/destination/transporter
   * @param options.serverSide - Use server-side pagination/search (default: false)
   */
  async function fetchShipments(options?: {
    page?: number
    limit?: number
    search?: string
    serverSide?: boolean
  }) {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.fetchShipments(options)

      // Handle server-side pagination response
      if (options?.serverSide && data.pagination) {
        shipments.value = data.shipments
        totalShipments.value = data.pagination.total
        currentPage.value = data.pagination.page
        itemsPerPage.value = data.pagination.limit
        if (options.search) {
          searchQuery.value = options.search
        }
      } else {
        // Client-side: load all shipments
        shipments.value = data.shipments
        totalShipments.value = data.shipments.length
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch shipments'
      console.error('Error fetching shipments:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single shipment by ID
   * Updates the currentShipment state with the fetched data
   *
   * @param id - Shipment ID
   * @returns The shipment object or null if not found
   */
  async function fetchShipmentById(id: string) {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.fetchShipmentById(id)
      currentShipment.value = data.shipment
      return data.shipment
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch shipment'
      console.error('Error fetching shipment by ID:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch all available transporters from the API
   * Updates the transporters state with the fetched data
   */
  async function fetchTransporters() {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.fetchTransporters()
      transporters.value = data.transporters
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch transporters'
      console.error('Error fetching transporters:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Assign or re-assign a transporter to a shipment
   *
   * Business rules enforced:
   * - Vehicle type must match between shipment and transporter
   * - Transporter cannot be assigned to multiple shipments simultaneously
   * - Updates shipment status to 'assigned' upon successful assignment
   *
   * @param shipmentId - The ID of the shipment
   * @param transporterId - The ID of the transporter to assign
   * @returns Object with success flag and either shipment data or error message
   */
  async function assignTransporterToShipment(shipmentId: string, transporterId: string) {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.assignTransporter(shipmentId, transporterId)

      // Update local state to reflect the assignment
      const index = shipments.value.findIndex((shipment) => shipment.id === shipmentId)
      if (index !== -1) {
        shipments.value[index] = data.shipment
      }

      // Update currentShipment if it's the one being modified
      if (currentShipment.value && currentShipment.value.id === shipmentId) {
        currentShipment.value = data.shipment
      }

      return { success: true, shipment: data.shipment }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to assign transporter'
      error.value = errorMsg
      console.error('Error assigning transporter:', e)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new shipment
   *
   * @param shipmentData - Shipment data to create
   * @returns Object with success flag and either shipment data or error message
   */
  async function createShipment(shipmentData: Partial<Shipment>) {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.createShipment(shipmentData)

      // Add the new shipment to the list
      shipments.value.unshift(data.shipment)
      totalShipments.value += 1

      return { success: true, shipment: data.shipment }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to create shipment'
      error.value = errorMsg
      console.error('Error creating shipment:', e)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing shipment
   *
   * @param shipmentId - The ID of the shipment to update
   * @param shipmentData - Partial shipment data to update
   * @returns Object with success flag and either shipment data or error message
   */
  async function updateShipment(shipmentId: string, shipmentData: Partial<Shipment>) {
    loading.value = true
    error.value = null

    try {
      const data = await shipmentApi.updateShipment(shipmentId, shipmentData)

      // Update local state
      const index = shipments.value.findIndex((shipment) => shipment.id === shipmentId)
      if (index !== -1) {
        shipments.value[index] = data.shipment
      }

      // Update currentShipment if it's the one being modified
      if (currentShipment.value && currentShipment.value.id === shipmentId) {
        currentShipment.value = data.shipment
      }

      return { success: true, shipment: data.shipment }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to update shipment'
      error.value = errorMsg
      console.error('Error updating shipment:', e)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a shipment
   *
   * @param shipmentId - The ID of the shipment to delete
   * @returns Object with success flag and error message if failed
   */
  async function deleteShipment(shipmentId: string) {
    loading.value = true
    error.value = null

    try {
      await shipmentApi.deleteShipment(shipmentId)

      // Remove from local state
      const index = shipments.value.findIndex((shipment) => shipment.id === shipmentId)
      if (index !== -1) {
        shipments.value.splice(index, 1)
        totalShipments.value -= 1
      }

      // Clear currentShipment if it was deleted
      if (currentShipment.value && currentShipment.value.id === shipmentId) {
        currentShipment.value = null
      }

      return { success: true }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to delete shipment'
      error.value = errorMsg
      console.error('Error deleting shipment:', e)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  // ==================== Real-time Updates ====================

  /** Interval ID for the real-time update timer */
  let updateInterval: number | null = null

  /**
   * Start real-time status update simulation
   *
   * Simulates shipment status changes by randomly selecting shipments and
   * updating their status based on realistic state transitions every 5 seconds.
   *
   * Status transition rules:
   * - not-assigned → stays not-assigned (waiting for transporter)
   * - assigned → can transition to in-transit (30% chance)
   * - in-transit → can transition to delivered (20% chance)
   * - delivered → terminal state (no changes)
   * - cancelled → terminal state (no changes)
   *
   * Note: Prevents duplicate instances by checking if already running
   */
  function startRealTimeUpdates() {
    // Prevent multiple intervals from running
    if (updateInterval) return

    updateInterval = window.setInterval(async () => {
      if (shipments.value.length === 0) return

      // Randomly select a shipment for status update
      const randomIndex = Math.floor(Math.random() * shipments.value.length)
      const shipment = shipments.value[randomIndex]

      if (!shipment) return

      // Determine next status based on current status (realistic transitions)
      let newStatus: Shipment['status']
      switch (shipment.status) {
        case 'not-assigned':
          // Stays not-assigned until a transporter is assigned
          newStatus = 'not-assigned'
          break
        case 'assigned':
          // 30% chance to move to in-transit, otherwise stays assigned
          newStatus = Math.random() > 0.7 ? 'in-transit' : 'assigned'
          break
        case 'in-transit':
          // 20% chance to be delivered, otherwise stays in-transit
          newStatus = Math.random() > 0.8 ? 'delivered' : 'in-transit'
          break
        case 'delivered':
        case 'cancelled':
          // Terminal states - no further transitions
          newStatus = shipment.status
          break
        default:
          newStatus = shipment.status
      }

      // Persist status change via API and update local state
      try {
        const data = await shipmentApi.updateShipmentStatus(shipment.id, newStatus)

        // Update the shipment in the list (direct mutation is reactive)
        shipment.status = data.shipment.status

        // Update currentShipment if viewing the same shipment
        if (currentShipment.value?.id === shipment.id) {
          currentShipment.value = { ...currentShipment.value, status: data.shipment.status }
        }
      } catch (err) {
        console.error('[Real-time Update] Failed to update shipment status:', err)
      }
    }, 5000) // Update interval: 5 seconds
  }

  /**
   * Stop real-time status update simulation
   * Clears the update interval and resets state
   */
  function stopRealTimeUpdates() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  return {
    // State
    shipments,
    currentShipment,
    transporters,
    loading,
    error,
    totalShipments,
    currentPage,
    itemsPerPage,
    searchQuery,
    // Getters
    assignedShipments,
    notAssignedShipments,
    totalPages,
    getTransporterById,
    assignedTransporterIds,
    isTransporterAvailable,
    // Actions
    fetchShipments,
    fetchShipmentById,
    fetchTransporters,
    assignTransporterToShipment,
    createShipment,
    updateShipment,
    deleteShipment,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  }
})
