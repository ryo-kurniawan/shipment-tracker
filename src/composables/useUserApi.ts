import type { User } from '@/types/user'

/**
 * User API Composable
 *
 * Handles all HTTP requests related to user authentication and user management.
 * Separates API logic from state management for better maintainability.
 */

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token?: string
  message?: string
}

interface ErrorResponse {
  errors?: string[]
  message?: string
}

interface LogoutResponse {
  message: string
  success: boolean
}

export function useUserApi() {
  /**
   * Login user with email and password
   *
   * @param credentials - User login credentials
   * @returns Promise with user data and optional token
   */
  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      const errorMsg =
        errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : errorData.message || 'Login failed'
      throw new Error(errorMsg)
    }

    return await response.json()
  }

  /**
   * Logout current user
   *
   * @returns Promise with logout confirmation
   */
  async function logout(): Promise<LogoutResponse> {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    return await response.json()
  }

  return {
    login,
    logout,
  }
}
