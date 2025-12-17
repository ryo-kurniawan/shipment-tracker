import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'

/**
 * Shipment API Composable
 *
 * Handles all HTTP requests related to shipments and transporters.
 * Separates API logic from state management for better maintainability.
 */

interface FetchShipmentsOptions {
  page?: number
  limit?: number
  search?: string
  serverSide?: boolean
}

interface ShipmentsResponse {
  shipments: Shipment[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ShipmentResponse {
  shipment: Shipment
}

interface TransportersResponse {
  transporters: Transporter[]
}

interface AssignTransporterResponse {
  shipment: Shipment
  message?: string
}

interface ErrorResponse {
  errors?: string[]
  message?: string
}

export function useShipmentApi() {
  /**
   * Fetch shipments with optional pagination and search
   *
   * @param options - Pagination and search parameters
   * @returns Promise with shipments data
   */
  async function fetchShipments(options?: FetchShipmentsOptions): Promise<ShipmentsResponse> {
    const params = new URLSearchParams()

    if (options?.serverSide) {
      if (options.page) {
        params.append('page', options.page.toString())
      }
      if (options.limit) {
        params.append('limit', options.limit.toString())
      }
      if (options.search) {
        params.append('search', options.search)
      }
    }

    const url = params.toString() ? `/api/shipments?${params.toString()}` : '/api/shipments'

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch shipments: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Fetch a single shipment by ID
   *
   * @param id - Shipment ID
   * @returns Promise with shipment data
   */
  async function fetchShipmentById(id: string): Promise<ShipmentResponse> {
    const response = await fetch(`/api/shipments/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch shipment: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Fetch all available transporters
   *
   * @returns Promise with transporters data
   */
  async function fetchTransporters(): Promise<TransportersResponse> {
    const response = await fetch('/api/transporters')

    if (!response.ok) {
      throw new Error(`Failed to fetch transporters: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Assign a transporter to a shipment
   *
   * @param shipmentId - The ID of the shipment
   * @param transporterId - The ID of the transporter to assign
   * @returns Promise with updated shipment data
   */
  async function assignTransporter(
    shipmentId: string,
    transporterId: string,
  ): Promise<AssignTransporterResponse> {
    const response = await fetch(`/api/shipments/${shipmentId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transporterId }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      const errorMsg =
        errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : errorData.message || 'Failed to assign transporter'
      throw new Error(errorMsg)
    }

    return await response.json()
  }

  /**
   * Update shipment status
   *
   * @param shipmentId - The ID of the shipment
   * @param status - New status value
   * @returns Promise with updated shipment data
   */
  async function updateShipmentStatus(
    shipmentId: string,
    status: Shipment['status'],
  ): Promise<ShipmentResponse> {
    const response = await fetch(`/api/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update shipment status: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Create a new shipment
   *
   * @param shipmentData - Shipment data to create
   * @returns Promise with created shipment data
   */
  async function createShipment(shipmentData: Partial<Shipment>): Promise<ShipmentResponse> {
    const response = await fetch('/api/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      const errorMsg =
        errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : errorData.message || 'Failed to create shipment'
      throw new Error(errorMsg)
    }

    return await response.json()
  }

  /**
   * Update an existing shipment
   *
   * @param shipmentId - The ID of the shipment to update
   * @param shipmentData - Partial shipment data to update
   * @returns Promise with updated shipment data
   */
  async function updateShipment(
    shipmentId: string,
    shipmentData: Partial<Shipment>,
  ): Promise<ShipmentResponse> {
    const response = await fetch(`/api/shipments/${shipmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      const errorMsg =
        errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : errorData.message || 'Failed to update shipment'
      throw new Error(errorMsg)
    }

    return await response.json()
  }

  /**
   * Delete a shipment
   *
   * @param shipmentId - The ID of the shipment to delete
   * @returns Promise with success response
   */
  async function deleteShipment(
    shipmentId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/shipments/${shipmentId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete shipment: ${response.statusText}`)
    }

    return await response.json()
  }

  return {
    fetchShipments,
    fetchShipmentById,
    fetchTransporters,
    assignTransporter,
    updateShipmentStatus,
    createShipment,
    updateShipment,
    deleteShipment,
  }
}
