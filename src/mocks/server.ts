/**
 * Mirage.js Mock API Server
 * 
 * Provides a mock REST API for development and testing without a real backend.
 * 
 * Endpoints:
 * - GET    /api/shipments          - Get all shipments
 * - GET    /api/shipments/:id      - Get single shipment by ID
 * - GET    /api/transporters        - Get all transporters
 * - PATCH  /api/shipments/:id/assign - Assign transporter to shipment
 * - PATCH  /api/shipments/:id/status - Update shipment status (for real-time simulation)
 * 
 * Business Rules Enforced:
 * - Vehicle type must match between shipment and transporter
 * - Transporters cannot be double-booked (one shipment at a time)
 * - Status updates are persisted for real-time simulation
 */

import { createServer, Model, Response } from 'miragejs'
import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'
import { shipments, transporters } from './data'

/**
 * Create and configure the Mirage.js mock server
 * @returns Configured Mirage server instance
 */
export function makeServer() {
  return createServer({
    models: {
      shipment: Model,
      transporter: Model,
    },

    /**
     * Seed the database with initial data
     */
    seeds(server) {
      shipments.forEach((shipment) => server.create('shipment', shipment))
      transporters.forEach((transporter) => server.create('transporter', transporter))
    },

    /**
     * Define API routes and handlers
     */
    routes() {
      this.namespace = 'api'
      this.timing = 500 // Simulate network delay (500ms)

      /**
       * GET /api/shipments
       * Retrieve all shipments
       */
      this.get('/shipments', (schema) => {
        return schema.all('shipment')
      })

      /**
       * GET /api/shipments/:id
       * Retrieve a single shipment by ID
       */
      this.get('/shipments/:id', (schema, request) => {
        const id = request.params.id
        if (!id) {
          return new Response(400, {}, { errors: ['Shipment ID is required'] })
        }
        return schema.find('shipment', id)
      })

      /**
       * GET /api/transporters
       * Retrieve all available transporters
       */
      this.get('/transporters', (schema) => {
        return schema.all('transporter')
      })

      /**
       * PATCH /api/shipments/:id/assign
       * Assign or re-assign a transporter to a shipment
       * 
       * Validation rules:
       * 1. Shipment and transporter must exist
       * 2. Vehicle types must match exactly
       * 3. Transporter cannot be assigned to multiple shipments simultaneously
       * 4. Updates shipment status to 'assigned' upon success
       * 
       * @param {string} id - Shipment ID
       * @param {string} transporterId - Transporter ID to assign
       */
      this.patch('/shipments/:id/assign', (schema, request) => {
        const id = request.params.id
        if (!id) {
          return new Response(400, {}, { errors: ['Shipment ID is required'] })
        }

        const attrs = JSON.parse(request.requestBody)
        const shipment = schema.find('shipment', id)

        if (!shipment) {
          return new Response(404, {}, { errors: ['Shipment not found'] })
        }

        if (!attrs.transporterId) {
          return new Response(400, {}, { errors: ['transporterId is required'] })
        }

        const transporter = schema.find('transporter', attrs.transporterId)
        if (!transporter) {
          return new Response(404, {}, { errors: ['Transporter not found'] })
        }

        // Type casting for TypeScript to access model properties
        const shipmentData = shipment.attrs as Shipment
        const transporterData = transporter.attrs as Transporter

        // Business Rule 1: Vehicle type must match
        if (shipmentData.vehicleType !== transporterData.vehicleType) {
          return new Response(
            400,
            {},
            {
              errors: [
                `Vehicle type mismatch: Shipment requires ${shipmentData.vehicleType}, but transporter has ${transporterData.vehicleType}`,
              ],
            },
          )
        }

        // Business Rule 2: Transporter cannot be double-booked
        // Check if this transporter is already assigned or actively transporting another shipment
        const existingAssignment = schema
          .all('shipment')
          .models.find(
            (s) => {
              const shipmentAttrs = s.attrs as Shipment
              return (
                shipmentAttrs.transporterId === attrs.transporterId &&
                (shipmentAttrs.status === 'assigned' || shipmentAttrs.status === 'in-transit') &&
                s.id !== id // Exclude current shipment (allows re-assignment)
              )
            },
          )

        if (existingAssignment) {
          const existingShipmentData = existingAssignment.attrs as Shipment
          return new Response(
            400,
            {},
            {
              errors: [
                `Transporter ${transporterData.name} is already ${existingShipmentData.status === 'in-transit' ? 'actively transporting' : 'assigned to'} shipment ${existingShipmentData.id}`,
              ],
            },
          )
        }

        // Update shipment with transporter assignment
        shipment.update({
          transporterId: attrs.transporterId,
          status: 'assigned',
        })

        return shipment
      })

      /**
       * PATCH /api/shipments/:id/status
       * Update shipment status (used for real-time simulation)
       * 
       * This endpoint is called by the real-time update simulation
       * to persist status changes across the application.
       * 
       * @param {string} id - Shipment ID
       * @param {string} status - New status value
       */
      this.patch('/shipments/:id/status', (schema, request) => {
        const id = request.params.id
        if (!id) {
          return new Response(400, {}, { errors: ['Shipment ID is required'] })
        }

        const shipment = schema.find('shipment', id)
        if (!shipment) {
          return new Response(404, {}, { errors: ['Shipment not found'] })
        }

        const attrs = JSON.parse(request.requestBody)
        if (!attrs.status) {
          return new Response(400, {}, { errors: ['Status is required'] })
        }

        // Update the status
        shipment.update({ status: attrs.status })
        return shipment
      })
    },
  })
}
