<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useShipmentStore } from '@/stores/shipmentStore'
import ShipmentCard from '@/components/ShipmentCard.vue'
import StatusUpdateNotification from '@/components/StatusUpdateNotification.vue'
import Navbar from '@/components/Navbar.vue'
import PageHeader from '@/components/PageHeader.vue'
import RealTimeToggle from '@/components/RealTimeToggle.vue'
import SearchBar from '@/components/SearchBar.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import LoadingState from '@/components/Loading.vue'
import ErrorState from '@/components/Error.vue'
import EmptyState from '@/components/Empty.vue'

/**
 * ShipmentListView Component (Refactored)
 * Main view for displaying shipment list with search and pagination
 */

const shipmentStore = useShipmentStore()

/** Controls whether real-time updates are enabled (default: off) */
const realTimeEnabled = ref(false)

/** Search query for filtering shipments */
const searchQuery = ref('')

/** Current page number (1-indexed) */
const currentPage = ref(1)

/** Number of shipments to display per page */
const itemsPerPage = ref(9)

/** Toggle between client-side and server-side pagination/search */
const useServerSide = ref(false)

// Debounce timer for search
let searchDebounceTimer: number | null = null

// Lifecycle hooks
onMounted(() => {
  loadShipments()
})

onUnmounted(() => {
  shipmentStore.stopRealTimeUpdates()
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})

/**
 * Load shipments based on current pagination/search settings
 */
async function loadShipments() {
  if (useServerSide.value) {
    await shipmentStore.fetchShipments({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      serverSide: true,
    })
  } else {
    await shipmentStore.fetchShipments()
  }
}

/**
 * Watch for page changes (server-side only)
 */
watch(currentPage, () => {
  if (useServerSide.value) {
    loadShipments()
  }
})

/**
 * Watch for search query changes with debounce
 */
watch(searchQuery, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)

  searchDebounceTimer = window.setTimeout(() => {
    currentPage.value = 1
    if (useServerSide.value) {
      loadShipments()
    }
  }, 300)
})

/**
 * CLIENT-SIDE FILTERING AND PAGINATION
 */

/** Filter shipments based on search query (client-side) */
const filteredShipments = computed(() => {
  if (useServerSide.value) {
    return shipmentStore.shipments
  }

  if (!searchQuery.value.trim()) {
    return shipmentStore.shipments
  }

  const query = searchQuery.value.toLowerCase().trim()
  return shipmentStore.shipments.filter((shipment) => {
    return (
      shipment.origin.toLowerCase().includes(query) ||
      shipment.destination.toLowerCase().includes(query)
    )
  })
})

/** Calculate total number of pages based on filtered results */
const totalPages = computed(() => {
  if (useServerSide.value) {
    return shipmentStore.totalPages
  }
  return Math.ceil(filteredShipments.value.length / itemsPerPage.value)
})

/** Total results count */
const totalResults = computed(() => {
  if (useServerSide.value) {
    return shipmentStore.totalShipments
  }
  return filteredShipments.value.length
})

/** Get shipments for the current page */
const paginatedShipments = computed(() => {
  if (useServerSide.value) {
    return shipmentStore.shipments
  }

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredShipments.value.slice(start, end)
})

/** Calculate display indices for "Showing X to Y of Z" */
const displayStart = computed(() => {
  if (totalResults.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const displayEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalResults.value)
})

/**
 * Navigate to a specific page
 */
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/**
 * Reset to page 1 when search query changes
 */
function handleSearchInput() {
  if (!useServerSide.value) {
    currentPage.value = 1
  }
}

/**
 * Toggle real-time status updates on/off
 */
function toggleRealTime() {
  realTimeEnabled.value = !realTimeEnabled.value
  if (realTimeEnabled.value) {
    shipmentStore.startRealTimeUpdates()
  } else {
    shipmentStore.stopRealTimeUpdates()
  }
}

/**
 * Clear search query
 */
function clearSearch() {
  searchQuery.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navbar />

      <!-- Header Section -->
      <PageHeader :real-time-enabled="realTimeEnabled" :use-server-side="useServerSide">
        <template #toggle>
          <RealTimeToggle :enabled="realTimeEnabled" @toggle="toggleRealTime" />
        </template>
      </PageHeader>

      <!-- Search Bar -->
      <SearchBar
        v-model="searchQuery"
        :total-results="totalResults"
        :show-results-count="!useServerSide"
        @input="handleSearchInput"
      />

      <!-- Loading State -->
      <LoadingState v-if="shipmentStore.loading" message="Loading shipments..." />

      <!-- Error State -->
      <ErrorState
        v-else-if="shipmentStore.error"
        title="Error Loading Shipments"
        :message="shipmentStore.error"
      />

      <!-- Shipments Grid -->
      <div v-else-if="paginatedShipments.length > 0" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShipmentCard
            v-for="shipment in paginatedShipments"
            :key="shipment.id"
            :shipment="shipment"
          />
        </div>

        <!-- Pagination Controls -->
        <PaginationControls
          :current-page="currentPage"
          :total-pages="totalPages"
          :display-start="displayStart"
          :display-end="displayEnd"
          :total-results="totalResults"
          @go-to-page="goToPage"
        />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="!shipmentStore.loading && paginatedShipments.length === 0"
        :has-search-query="!!searchQuery"
        :search-query="searchQuery"
        @clear-search="clearSearch"
      />
    </div>

    <!-- Status Update Notifications -->
    <StatusUpdateNotification v-if="realTimeEnabled" />
  </div>
</template>
