import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { useUserApi } from '@/composables/useUserApi'

/**
 * User Store (Refactored with API Composable)
 *
 * Manages user authentication state and user-related operations.
 * Handles login, logout, registration, and profile management.
 *
 * Features:
 * - User authentication (login/logout)
 * - User registration
 * - Profile management
 * - Password management
 * - Session persistence with localStorage
 * - Separation of concerns: API logic moved to composable
 */
export const useUserStore = defineStore('user', () => {
  // ==================== API Composable ====================
  const userApi = useUserApi()

  // ==================== State ====================

  /** Current authenticated user */
  const user = ref<User | null>(null)

  /** Loading state for async operations */
  const loading = ref(false)

  /** Error message from failed operations */
  const error = ref<string | null>(null)

  // ==================== Getters ====================

  /** Check if user is authenticated */
  const isAuthenticated = computed(() => user.value !== null)

  /** Get current user role */
  const userRole = computed(() => (user.value ? user.value.role : null))

  /** Get current user email */
  const userEmail = computed(() => (user.value ? user.value.email : null))

  /** Get current user name */
  const userName = computed(() => (user.value ? user.value.name : null))

  // ==================== Local Storage Management ====================

  /**
   * Save user data to localStorage
   * @param userData - User data to save
   */
  function saveUserToStorage(userData: User) {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      console.error('Failed to save user to localStorage:', err)
    }
  }

  /**
   * Restore user session from localStorage
   * Called on app initialization to restore user state
   */
  function loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    } catch (err) {
      console.error('Failed to load user from localStorage:', err)
      localStorage.removeItem('user')
    }
  }

  /**
   * Clear user data from localStorage
   */
  function clearUserFromStorage() {
    try {
      localStorage.removeItem('user')
    } catch (err) {
      console.error('Failed to clear user from localStorage:', err)
    }
  }

  // ==================== Actions ====================

  /**
   * Login user with email and password
   *
   * @param email - User email
   * @param password - User password
   * @returns Object with success flag and optional error
   */
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const data = await userApi.login({ email, password })

      user.value = data.user
      saveUserToStorage(data.user)

      return { success: true, user: data.user }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during login'
      error.value = errorMsg
      console.error('Login error:', err)
      return { success: false, error: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout current user
   * Clears user state and removes from localStorage
   *
   * @param callApi - Whether to call the logout API (default: true)
   * @returns Object with success flag
   */
  async function logout(callApi: boolean = true) {
    loading.value = true
    error.value = null

    try {
      if (callApi) {
        await userApi.logout()
      }

      user.value = null
      clearUserFromStorage()

      return { success: true }
    } catch (err) {
      // Even if API call fails, clear local state
      user.value = null
      clearUserFromStorage()

      const errorMsg = err instanceof Error ? err.message : 'An error occurred during logout'
      console.error('Logout error:', err)

      return { success: true } // Still consider it successful locally
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    userEmail,
    userName,
    // Actions
    login,
    logout,
    loadUserFromStorage,
    clearError,
  }
})
