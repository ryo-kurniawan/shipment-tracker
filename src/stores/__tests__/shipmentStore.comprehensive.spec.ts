import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useShipmentStore } from '../shipmentStore'
import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'

// Mock fetch
global.fetch = vi.fn()

describe('Shipment Store - Comprehensive Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Shipment Filtering', () => {
    it('should filter assigned shipments correctly', () => {
      const store = useShipmentStore()
      store.shipments = [
        {
          id: '1',
          status: 'assigned',
          origin: 'Jakarta',
          destination: 'Surabaya',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T10:00:00Z',
        } as Shipment,
        {
          id: '2',
          status: 'not-assigned',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Van',
          createdAt: '2025-12-10T11:00:00Z',
        } as Shipment,
        {
          id: '3',
          status: 'in-transit',
          origin: 'Medan',
          destination: 'Padang',
          route: 'Medan → Padang',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T12:00:00Z',
        } as Shipment,
      ]

      expect(store.assignedShipments).toHaveLength(1)
      expect(store.assignedShipments[0]?.id).toBe('1')
    })

    it('should filter not-assigned shipments correctly', () => {
      const store = useShipmentStore()
      store.shipments = [
        {
          id: '1',
          status: 'assigned',
          origin: 'Jakarta',
          destination: 'Surabaya',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T10:00:00Z',
        } as Shipment,
        {
          id: '2',
          status: 'not-assigned',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Van',
          createdAt: '2025-12-10T11:00:00Z',
        } as Shipment,
      ]

      expect(store.notAssignedShipments).toHaveLength(1)
      expect(store.notAssignedShipments[0]?.id).toBe('2')
    })
  })

  describe('Transporter Availability', () => {
    beforeEach(() => {
      const store = useShipmentStore()
      store.shipments = [
        {
          id: '1',
          status: 'assigned',
          transporterId: 'T1',
          origin: 'Jakarta',
          destination: 'Surabaya',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T10:00:00Z',
        } as Shipment,
        {
          id: '2',
          status: 'not-assigned',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Van',
          createdAt: '2025-12-10T11:00:00Z',
        } as Shipment,
      ]

      store.transporters = [
        {
          id: 'T1',
          name: 'Transporter 1',
          vehicleType: 'Truck',
          email: 't1@test.com',
          phone: '123',
        } as Transporter,
        {
          id: 'T2',
          name: 'Transporter 2',
          vehicleType: 'Van',
          email: 't2@test.com',
          phone: '456',
        } as Transporter,
      ]
    })

    it('should identify assigned transporters correctly', () => {
      const store = useShipmentStore()
      expect(store.assignedTransporterIds).toContain('T1')
      expect(store.assignedTransporterIds).not.toContain('T2')
    })

    it('should check if transporter is available', () => {
      const store = useShipmentStore()
      // T1 is assigned to shipment 1
      expect(store.isTransporterAvailable('T1')).toBe(false)
      // T2 is not assigned
      expect(store.isTransporterAvailable('T2')).toBe(true)
    })

    it('should allow transporter for same shipment (re-assignment)', () => {
      const store = useShipmentStore()
      // T1 is assigned to shipment 1, but should be available for re-assigning to shipment 1
      expect(store.isTransporterAvailable('T1', '1')).toBe(true)
    })
  })

  describe('Transporter Lookup', () => {
    it('should find transporter by ID', () => {
      const store = useShipmentStore()
      store.transporters = [
        {
          id: 'T1',
          name: 'Transporter 1',
          vehicleType: 'Truck',
          email: 't1@test.com',
          phone: '123',
        } as Transporter,
        {
          id: 'T2',
          name: 'Transporter 2',
          vehicleType: 'Van',
          email: 't2@test.com',
          phone: '456',
        } as Transporter,
      ]

      const transporter = store.getTransporterById('T1')
      expect(transporter).toBeDefined()
      expect(transporter?.name).toBe('Transporter 1')
    })

    it('should return undefined for non-existent transporter', () => {
      const store = useShipmentStore()
      store.transporters = []

      const transporter = store.getTransporterById('T999')
      expect(transporter).toBeUndefined()
    })
  })

  describe('Fetch Operations', () => {
    it('should fetch shipments successfully', async () => {
      const store = useShipmentStore()
      const mockShipments = [
        {
          id: '1',
          status: 'assigned',
          origin: 'Jakarta',
          destination: 'Surabaya',
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => ({ shipments: mockShipments }),
      })

      await store.fetchShipments()

      expect(store.shipments).toHaveLength(1)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle fetch error', async () => {
      const store = useShipmentStore()
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await store.fetchShipments()

      expect(store.error).toBe('Failed to fetch shipments')
      expect(store.loading).toBe(false)
    })

    it('should fetch transporters successfully', async () => {
      const store = useShipmentStore()
      const mockTransporters = [{ id: 'T1', name: 'Transporter 1', vehicleType: 'Truck' }]

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => ({ transporters: mockTransporters }),
      })

      await store.fetchTransporters()

      expect(store.transporters).toHaveLength(1)
      expect(store.loading).toBe(false)
    })
  })

  describe('Transporter Assignment', () => {
    it('should assign transporter successfully', async () => {
      const store = useShipmentStore()
      store.shipments = [
        {
          id: '1',
          status: 'not-assigned',
          origin: 'Jakarta',
          destination: 'Surabaya',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T10:00:00Z',
        } as Shipment,
      ]

      const updatedShipment = {
        id: '1',
        status: 'assigned',
        transporterId: 'T1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ shipment: updatedShipment }),
      })

      const result = await store.assignTransporterToShipment('1', 'T1')

      expect(result.success).toBe(true)
      expect(store.shipments[0]?.status).toBe('assigned')
      expect(store.shipments[0]?.transporterId).toBe('T1')
    })

    it('should handle assignment failure', async () => {
      const store = useShipmentStore()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Vehicle type mismatch'] }),
      })

      const result = await store.assignTransporterToShipment('1', 'T1')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Real-time Updates', () => {
    it('should start and stop real-time updates', () => {
      const store = useShipmentStore()

      store.startRealTimeUpdates()
      // Should not create duplicate interval
      store.startRealTimeUpdates()

      store.stopRealTimeUpdates()
      // Should handle being called when already stopped
      store.stopRealTimeUpdates()
    })
  })
})
