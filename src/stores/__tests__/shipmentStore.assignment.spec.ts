import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useShipmentStore } from '../shipmentStore'
import type { Shipment } from '@/types/shipment'

// Mock fetch
global.fetch = vi.fn()

describe('Transporter Assignment - Minimal Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  /**
   * TEST: Verify transporter assignment logic
   *
   * This test verifies that:
   * 1. A transporter can be successfully assigned to a shipment
   * 2. The shipment status changes to "assigned" after assignment
   * 3. The transporterId is correctly set on the shipment
   * 4. The store state is updated properly
   */
  it('should successfully assign transporter to shipment and update status', async () => {
    const store = useShipmentStore()

    // Setup: Create a shipment that needs a transporter
    store.shipments = [
      {
        id: 'shipment-1',
        status: 'not-assigned',
        origin: 'Jakarta',
        destination: 'Surabaya',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      } as Shipment,
    ]

    // Mock API response for successful assignment
    const updatedShipment = {
      id: 'shipment-1',
      status: 'assigned',
      transporterId: 'transporter-123',
      origin: 'Jakarta',
      destination: 'Surabaya',
      route: 'Jakarta → Surabaya',
      vehicleType: 'Truck',
      createdAt: '2025-12-10T10:00:00Z',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shipment: updatedShipment }),
      statusText: 'OK',
    })

    // Act: Assign transporter to shipment
    const result = await store.assignTransporterToShipment('shipment-1', 'transporter-123')

    // Assert: Verify assignment was successful
    expect(result.success).toBe(true)
    expect(result.shipment).toBeDefined()

    // Assert: Verify shipment status changed to "assigned"
    expect(store.shipments[0]?.status).toBe('assigned')

    // Assert: Verify transporterId was set correctly
    expect(store.shipments[0]?.transporterId).toBe('transporter-123')

    // Assert: Verify store is not in loading state
    expect(store.loading).toBe(false)

    // Assert: Verify no errors occurred
    expect(store.error).toBe(null)
  })
})
