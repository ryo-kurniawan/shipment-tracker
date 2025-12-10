import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Shipment Store
 * 
 * Manages the state for shipments and transporters in the application.
 * Handles CRUD operations, real-time updates, and business logic for transporter assignments.
 * 
 * Features:
 * - Fetch and manage shipments list
 * - Assign/re-assign transporters to shipments
 * - Real-time status update simulation
 * - Validation for vehicle type matching and transporter availability
 */
export const useShipmentStore = defineStore('shipment', () => {
  // ==================== State ====================
  
  /** List of all shipments */
  const shipments = ref<Shipment[]>([])
  
  /** Currently selected/viewed shipment */
  const currentShipment = ref<Shipment | null>(null)
  
  /** List of all available transporters */
  const transporters = ref<Transporter[]>([])
  
  /** Loading state for async operations */
  const loading = ref(false)
  
  /** Error message from failed operations */
  const error = ref<string | null>(null)

  // ==================== Getters ====================
  
  /** Get all shipments with 'assigned' status */
  const assignedShipments = computed(() =>
    shipments.value.filter((shipment) => shipment.status === 'assigned'),
  )

  /** Get all shipments with 'not-assigned' status */
  const notAssignedShipments = computed(() =>
    shipments.value.filter((shipment) => shipment.status === 'not-assigned'),
  )

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
   * Fetch all shipments from the API
   * Updates the shipments state with the fetched data
   */
  async function fetchShipments() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/shipments')
      const data = await response.json()
      shipments.value = data.shipments
    } catch (e) {
      error.value = 'Failed to fetch shipments'
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
      const response = await fetch(`/api/shipments/${id}`)
      const data = await response.json()
      currentShipment.value = data.shipment
      return data.shipment
    } catch (e) {
      error.value = 'Failed to fetch shipment'
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
      const response = await fetch('/api/transporters')
      const data = await response.json()
      transporters.value = data.transporters
    } catch (e) {
      error.value = 'Failed to fetch transporters'
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
      const response = await fetch(`/api/shipments/${shipmentId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transporterId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg =
          errorData.errors && errorData.errors.length > 0
            ? errorData.errors[0]
            : 'Failed to assign transporter'
        throw new Error(errorMsg)
      }

      const data = await response.json()

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

    updateInterval = window.setInterval(() => {
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
      fetch(`/api/shipments/${shipment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the shipment in the list (direct mutation is reactive)
          shipment.status = data.shipment.status

          // Update currentShipment if viewing the same shipment
          // Create new object for Vue reactivity system
          if (currentShipment.value?.id === shipment.id) {
            currentShipment.value = { ...currentShipment.value, status: data.shipment.status }
          }
        })
        .catch((err) => {
          console.error('[Real-time Update] Failed to update shipment status:', err)
        })
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
    // Getters
    assignedShipments,
    notAssignedShipments,
    getTransporterById,
    assignedTransporterIds,
    isTransporterAvailable,
    // Actions
    fetchShipments,
    fetchShipmentById,
    fetchTransporters,
    assignTransporterToShipment,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  }
})
