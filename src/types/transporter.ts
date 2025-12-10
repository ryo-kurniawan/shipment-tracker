/**
 * Represents a transporter who can be assigned to shipments
 */
export interface Transporter {
  id: string
  name: string
  email: string
  phone: string
  vehicleType: string
}

/**
 * Payload for assigning a transporter to a shipment
 */
export interface AssignTransporterPayload {
  transporterId: string
}
