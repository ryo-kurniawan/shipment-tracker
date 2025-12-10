/**
 * Vue Router Configuration
 * 
 * Defines application routes and navigation structure.
 * 
 * Routes:
 * - / → Redirects to /shipments
 * - /shipments → List view of all shipments
 * - /shipments/:id → Detail view for a specific shipment
 */

import { createRouter, createWebHistory } from 'vue-router'
import ShipmentListView from '@/views/ShipmentListView.vue'
import ShipmentDetailView from '@/views/ShipmentDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/shipments',
    },
    {
      path: '/shipments',
      name: 'shipments',
      component: ShipmentListView,
    },
    {
      path: '/shipments/:id',
      name: 'shipment-detail',
      component: ShipmentDetailView,
    },
  ],
})

export default router
