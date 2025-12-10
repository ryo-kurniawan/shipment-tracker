import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useShipmentStore } from '../shipmentStore'

describe('Shipment Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should filter assigned shipments', () => {
    const store = useShipmentStore()
    store.shipments = [
      { id: '1', status: 'assigned', origin: 'A', destination: 'B' } as any,
      { id: '2', status: 'not-assigned', origin: 'C', destination: 'D' } as any,
    ]

    expect(store.assignedShipments).toHaveLength(1)
    expect(store.assignedShipments[0]?.id).toBe('1')
  })

  it('should filter not assigned shipments', () => {
    const store = useShipmentStore()
    store.shipments = [
      { id: '1', status: 'assigned', origin: 'A', destination: 'B' } as any,
      { id: '2', status: 'not-assigned', origin: 'C', destination: 'D' } as any,
    ]

    expect(store.notAssignedShipments).toHaveLength(1)
    expect(store.notAssignedShipments[0]?.id).toBe('2')
  })
})
