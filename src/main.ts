/**
 * Main Application Entry Point
 * 
 * Initializes the Vue application with:
 * - Pinia for state management
 * - Vue Router for navigation
 * - Mirage.js mock API server (development only)
 * - Global styles (TailwindCSS)
 */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { makeServer } from './mocks/server'

// Initialize mock API server in development mode only
if (import.meta.env.DEV) {
  makeServer()
}

// Create Vue app instance
const app = createApp(App)

// Register plugins
app.use(createPinia()) // State management
app.use(router)         // Routing

// Mount app to DOM
app.mount('#app')
