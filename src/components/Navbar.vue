<template>
  <nav class="bg-blue-500 text-white shadow-md px-6 py-4 rounded-lg">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="text-xl font-semibold">
        <span class="font-medium">Welcome, {{ userName }}</span>
      </div>

      <!-- User Info -->
      <div class="flex items-center gap-4">
        <button
          @click="logout"
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-sm font-medium shadow-md rounded"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore' // Pinia store for user management
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// User details
const userName = userStore.user?.name || 'User'

// Logout handler
const logout = () => {
  userStore.logout() // Clear session
  router.push('/login') // Redirect to login
}
</script>
