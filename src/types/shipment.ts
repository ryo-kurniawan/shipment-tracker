/**
 * Represents a shipment in the tracking system
 */
export interface Shipment {
  id: string
  origin: string
  destination: string
  /**
   * Current status of the shipment
   * - not-assigned: Waiting for transporter assignment
   * - assigned: Transporter assigned, not yet in transit
   * - in-transit: Shipment is currently being transported
   * - delivered: Shipment has been delivered to destination
   * - cancelled: Shipment has been cancelled
   */
  status: 'not-assigned' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled'
  route: string
  vehicleType: string
  transporterId?: string
  createdAt: string
}
