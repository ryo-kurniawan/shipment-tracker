/**
 * Mock Data for Development and Testing
 *
 * Provides 15 sample shipments and transporters
 * for UI, role-based access, and pagination testing.
 */

import type { Shipment } from '@/types/shipment'
import type { Transporter } from '@/types/transporter'
import type { Role, User } from '@/types/user'

/**
 * Sample shipments (15 total)
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
  {
    id: 'SHP-006',
    origin: 'Jakarta',
    destination: 'Bandung',
    status: 'in-transit',
    route: 'Jakarta → Bandung',
    vehicleType: 'Van',
    transporterId: 'TRN-005',
    createdAt: '2025-12-05T11:20:00Z',
  },
  {
    id: 'SHP-007',
    origin: 'Surabaya',
    destination: 'Malang',
    status: 'delivered',
    route: 'Surabaya → Malang',
    vehicleType: 'Truck',
    transporterId: 'TRN-001',
    createdAt: '2025-12-03T09:45:00Z',
  },
  {
    id: 'SHP-008',
    origin: 'Semarang',
    destination: 'Solo',
    status: 'assigned',
    route: 'Semarang → Solo',
    vehicleType: 'Van',
    transporterId: 'TRN-006',
    createdAt: '2025-12-08T13:30:00Z',
  },
  {
    id: 'SHP-009',
    origin: 'Palembang',
    destination: 'Lampung',
    status: 'not-assigned',
    route: 'Palembang → Bandar Lampung',
    vehicleType: 'Truck',
    createdAt: '2025-12-09T15:00:00Z',
  },
  {
    id: 'SHP-010',
    origin: 'Balikpapan',
    destination: 'Samarinda',
    status: 'in-transit',
    route: 'Balikpapan → Samarinda',
    vehicleType: 'Container Truck',
    transporterId: 'TRN-007',
    createdAt: '2025-12-07T10:15:00Z',
  },
  {
    id: 'SHP-011',
    origin: 'Jakarta',
    destination: 'Bogor',
    status: 'delivered',
    route: 'Jakarta → Bogor',
    vehicleType: 'Van',
    transporterId: 'TRN-002',
    createdAt: '2025-12-02T08:00:00Z',
  },
  {
    id: 'SHP-012',
    origin: 'Pontianak',
    destination: 'Singkawang',
    status: 'not-assigned',
    route: 'Pontianak → Singkawang',
    vehicleType: 'Truck',
    createdAt: '2025-12-10T14:20:00Z',
  },
  {
    id: 'SHP-013',
    origin: 'Manado',
    destination: 'Gorontalo',
    status: 'assigned',
    route: 'Manado → Gorontalo',
    vehicleType: 'Van',
    transporterId: 'TRN-008',
    createdAt: '2025-12-08T07:45:00Z',
  },
  {
    id: 'SHP-014',
    origin: 'Batam',
    destination: 'Tanjung Pinang',
    status: 'in-transit',
    route: 'Batam → Tanjung Pinang',
    vehicleType: 'Container Truck',
    transporterId: 'TRN-009',
    createdAt: '2025-12-06T12:30:00Z',
  },
  {
    id: 'SHP-015',
    origin: 'Denpasar',
    destination: 'Singaraja',
    status: 'not-assigned',
    route: 'Denpasar → Singaraja',
    vehicleType: 'Truck',
    createdAt: '2025-12-09T16:00:00Z',
  },
]

/**
 * Transporters
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
  {
    id: 'TRN-005',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@transport.com',
    phone: '+62 813-5555-6666',
    vehicleType: 'Van',
  },
  {
    id: 'TRN-006',
    name: 'Ani Kusuma',
    email: 'ani.kusuma@transport.com',
    phone: '+62 821-7777-8888',
    vehicleType: 'Van',
  },
  {
    id: 'TRN-007',
    name: 'Hendra Setiawan',
    email: 'hendra.setiawan@transport.com',
    phone: '+62 822-9999-0000',
    vehicleType: 'Container Truck',
  },
  {
    id: 'TRN-008',
    name: 'Maya Sari',
    email: 'maya.sari@transport.com',
    phone: '+62 812-1234-5678',
    vehicleType: 'Van',
  },
  {
    id: 'TRN-009',
    name: 'Bambang Prasetyo',
    email: 'bambang.prasetyo@transport.com',
    phone: '+62 813-8765-4321',
    vehicleType: 'Container Truck',
  },
]

export const roles: Role[] = [
  { id: 'role-1', name: 'Admin' },
  { id: 'role-2', name: 'User' },
]

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@shipment.com',
    password: 'admin123',
    role: roles[0] as Role,
  },
  {
    id: 'user-2',
    name: 'Regular User',
    email: 'user@shipment.com',
    password: 'user123',
    role: roles[1] as Role,
  },
]
