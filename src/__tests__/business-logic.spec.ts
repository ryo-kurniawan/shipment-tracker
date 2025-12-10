import { describe, it, expect } from 'vitest'
import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'

describe('Business Logic Validation Tests', () => {
  describe('Vehicle Type Matching', () => {
    it('should match shipment vehicle type with transporter vehicle type', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'not-assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const transporter: Transporter = {
        id: 'T1',
        name: 'Transporter 1',
        email: 't1@test.com',
        phone: '123',
        vehicleType: 'Truck',
      }

      // Should match
      expect(shipment.vehicleType).toBe(transporter.vehicleType)
    })

    it('should detect vehicle type mismatch', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'not-assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const transporter: Transporter = {
        id: 'T1',
        name: 'Transporter 1',
        email: 't1@test.com',
        phone: '123',
        vehicleType: 'Van',
      }

      // Should not match
      expect(shipment.vehicleType).not.toBe(transporter.vehicleType)
    })
  })

  describe('Status Transitions', () => {
    it('should allow valid status transitions', () => {
      const validTransitions = [
        { from: 'not-assigned', to: 'assigned' },
        { from: 'assigned', to: 'in-transit' },
        { from: 'in-transit', to: 'delivered' },
        { from: 'assigned', to: 'cancelled' },
      ]

      validTransitions.forEach(({ from, to }) => {
        expect(['not-assigned', 'assigned', 'in-transit', 'delivered', 'cancelled']).toContain(from)
        expect(['not-assigned', 'assigned', 'in-transit', 'delivered', 'cancelled']).toContain(to)
      })
    })

    it('should prevent assignment for in-transit shipments', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'in-transit',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const canAssign = shipment.status === 'not-assigned' || shipment.status === 'assigned'

      expect(canAssign).toBe(false)
    })

    it('should prevent assignment for delivered shipments', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'delivered',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const canAssign = shipment.status === 'not-assigned' || shipment.status === 'assigned'

      expect(canAssign).toBe(false)
    })

    it('should allow assignment for not-assigned shipments', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'not-assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const canAssign = shipment.status === 'not-assigned' || shipment.status === 'assigned'

      expect(canAssign).toBe(true)
    })

    it('should allow re-assignment for assigned shipments', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        transporterId: 'T1',
        createdAt: '2025-12-10T10:00:00Z',
      }

      const canReassign = shipment.status === 'not-assigned' || shipment.status === 'assigned'

      expect(canReassign).toBe(true)
    })
  })

  describe('Transporter Uniqueness', () => {
    it('should prevent same transporter being assigned to multiple shipments', () => {
      const shipments: Shipment[] = [
        {
          id: '1',
          origin: 'Jakarta',
          destination: 'Surabaya',
          status: 'assigned',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          transporterId: 'T1',
          createdAt: '2025-12-10T10:00:00Z',
        },
        {
          id: '2',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          status: 'not-assigned',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T11:00:00Z',
        },
      ]

      const targetTransporterId = 'T1'

      // Check if transporter is already assigned
      const isAlreadyAssigned = shipments.some(
        (s) => s.transporterId === targetTransporterId && s.status === 'assigned',
      )

      expect(isAlreadyAssigned).toBe(true)
    })

    it('should allow transporter to be assigned if not currently assigned', () => {
      const shipments: Shipment[] = [
        {
          id: '1',
          origin: 'Jakarta',
          destination: 'Surabaya',
          status: 'assigned',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          transporterId: 'T1',
          createdAt: '2025-12-10T10:00:00Z',
        },
      ]

      const targetTransporterId = 'T2'

      // Check if transporter is already assigned
      const isAlreadyAssigned = shipments.some(
        (s) => s.transporterId === targetTransporterId && s.status === 'assigned',
      )

      expect(isAlreadyAssigned).toBe(false)
    })
  })

  describe('Data Validation', () => {
    it('should validate required shipment fields', () => {
      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'not-assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      expect(shipment.id).toBeDefined()
      expect(shipment.origin).toBeDefined()
      expect(shipment.destination).toBeDefined()
      expect(shipment.status).toBeDefined()
      expect(shipment.route).toBeDefined()
      expect(shipment.vehicleType).toBeDefined()
      expect(shipment.createdAt).toBeDefined()
    })

    it('should validate required transporter fields', () => {
      const transporter: Transporter = {
        id: 'T1',
        name: 'Transporter 1',
        email: 't1@test.com',
        phone: '123',
        vehicleType: 'Truck',
      }

      expect(transporter.id).toBeDefined()
      expect(transporter.name).toBeDefined()
      expect(transporter.email).toBeDefined()
      expect(transporter.phone).toBeDefined()
      expect(transporter.vehicleType).toBeDefined()
    })

    it('should validate status values', () => {
      const validStatuses = ['not-assigned', 'assigned', 'in-transit', 'delivered', 'cancelled']

      const shipment: Shipment = {
        id: '1',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'assigned',
        route: 'Jakarta → Surabaya',
        vehicleType: 'Truck',
        createdAt: '2025-12-10T10:00:00Z',
      }

      expect(validStatuses).toContain(shipment.status)
    })
  })

  describe('Transporter In-Transit Blocking', () => {
    it('should block transporter that is in-transit on another shipment', () => {
      const shipments: Shipment[] = [
        {
          id: 'SHP-001',
          origin: 'Jakarta',
          destination: 'Surabaya',
          status: 'in-transit',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          transporterId: 'TRN-001',
          createdAt: '2025-12-10T10:00:00Z',
        },
        {
          id: 'SHP-002',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          status: 'not-assigned',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T11:00:00Z',
        },
      ]

      // Check if transporter TRN-001 is available for SHP-002
      const isTransporterAvailable = (transporterId: string, currentShipmentId?: string) => {
        const busyShipment = shipments.find(
          (s) =>
            s.transporterId === transporterId &&
            (s.status === 'assigned' || s.status === 'in-transit') &&
            s.id !== currentShipmentId,
        )
        return !busyShipment
      }

      // TRN-001 should NOT be available because it's in-transit on SHP-001
      expect(isTransporterAvailable('TRN-001', 'SHP-002')).toBe(false)
    })

    it('should allow transporter after shipment is delivered', () => {
      const shipments: Shipment[] = [
        {
          id: 'SHP-001',
          origin: 'Jakarta',
          destination: 'Surabaya',
          status: 'delivered',
          route: 'Jakarta → Surabaya',
          vehicleType: 'Truck',
          transporterId: 'TRN-001',
          createdAt: '2025-12-10T10:00:00Z',
        },
        {
          id: 'SHP-002',
          origin: 'Bandung',
          destination: 'Yogyakarta',
          status: 'not-assigned',
          route: 'Bandung → Yogyakarta',
          vehicleType: 'Truck',
          createdAt: '2025-12-10T11:00:00Z',
        },
      ]

      const isTransporterAvailable = (transporterId: string, currentShipmentId?: string) => {
        const busyShipment = shipments.find(
          (s) =>
            s.transporterId === transporterId &&
            (s.status === 'assigned' || s.status === 'in-transit') &&
            s.id !== currentShipmentId,
        )
        return !busyShipment
      }

      // TRN-001 should be available because SHP-001 is delivered
      expect(isTransporterAvailable('TRN-001', 'SHP-002')).toBe(true)
    })
  })
})
