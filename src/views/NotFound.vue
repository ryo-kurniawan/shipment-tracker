<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 class="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p class="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
    <p class="text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
    <RouterLink
      to="/"
      class="inline-block px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-lg hover:bg-blue-600 transition-all"
    >
      Go Back Home
    </RouterLink>
  </div>
</template>
