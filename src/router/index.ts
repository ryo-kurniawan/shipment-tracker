import { createRouter, createWebHistory } from 'vue-router'
import ShipmentListView from '@/views/ShipmentListView.vue'
import ShipmentDetailView from '@/views/ShipmentDetailView.vue'
import Loginview from '@/views/Loginview.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login', // Redirect root to login page
    },
    {
      path: '/login',
      name: 'login',
      component: Loginview,
    },
    {
      path: '/shipments',
      name: 'shipments',
      component: ShipmentListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/shipments/:id',
      name: 'shipment-detail',
      component: ShipmentDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*', // Fallback for undefined routes
      name: 'not-found',
      component: NotFound, // Lazy load the NotFound page
    },
  ],
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user') // Check if a user is logged in

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires authentication and user is not authenticated
    return next({ name: 'login' })
  }

  if (to.name === 'login' && isAuthenticated) {
    // Redirect logged-in users who are visiting /login to the shipments list
    return next({ name: 'shipments' })
  }

  next() // Allow navigation
})

export default router
