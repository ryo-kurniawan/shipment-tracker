/**
 * Mock Data for Development and Testing
 * 
 * Provides sample shipments and transporters for the application.
 * This data is seeded into Mirage.js server on application startup.
 */

import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'

/**
 * Sample shipments with various statuses and vehicle types
 */
export const shipments: Shipment[] = [
  {
    id: 'SHP-001',
    origin: 'Jakarta',
    destination: 'Surabaya',
    status: 'not-assigned',
    route: 'Jakarta → Semarang → Surabaya',
    vehicleType: 'Truck',
    createdAt: '2025-12-08T10:00:00Z',
  },
  {
    id: 'SHP-002',
    origin: 'Bandung',
    destination: 'Yogyakarta',
    status: 'assigned',
    route: 'Bandung → Tasikmalaya → Yogyakarta',
    vehicleType: 'Van',
    transporterId: 'TRN-002',
    createdAt: '2025-12-07T14:30:00Z',
  },
  {
    id: 'SHP-003',
    origin: 'Medan',
    destination: 'Padang',
    status: 'not-assigned',
    route: 'Medan → Bukittinggi → Padang',
    vehicleType: 'Truck',
    createdAt: '2025-12-09T08:15:00Z',
  },
  {
    id: 'SHP-004',
    origin: 'Bali',
    destination: 'Lombok',
    status: 'assigned',
    route: 'Bali → Ferry → Lombok',
    vehicleType: 'Container Truck',
    transporterId: 'TRN-003',
    createdAt: '2025-12-06T16:45:00Z',
  },
  {
    id: 'SHP-005',
    origin: 'Makassar',
    destination: 'Manado',
    status: 'not-assigned',
    route: 'Makassar → Palu → Gorontalo → Manado',
    vehicleType: 'Truck',
    createdAt: '2025-12-10T09:00:00Z',
  },
]

/**
 * Sample transporters with different vehicle types
 * Vehicle types: Truck, Van, Container Truck
 */
export const transporters: Transporter[] = [
  {
    id: 'TRN-001',
    name: 'Budi Santoso',
    email: 'budi.santoso@transport.com',
    phone: '+62 812-3456-7890',
    vehicleType: 'Truck',
  },
  {
    id: 'TRN-002',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@transport.com',
    phone: '+62 813-9876-5432',
    vehicleType: 'Van',
  },
  {
    id: 'TRN-003',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@transport.com',
    phone: '+62 821-1111-2222',
    vehicleType: 'Container Truck',
  },
  {
    id: 'TRN-004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@transport.com',
    phone: '+62 822-3333-4444',
    vehicleType: 'Truck',
  },
]
