import { ApiResponse, PaginatedResponse } from '@/types'

/**
 * API Service for handling all HTTP requests
 * Centralized place for API calls with proper error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * User API endpoints
 */
export const userAPI = {
  getAll: () =>
    apiCall<PaginatedResponse<Record<string, unknown>[]>>('/users'),

  getById: (id: string) =>
    apiCall<ApiResponse<Record<string, unknown>>>(`/users/${id}`),

  create: (data: Record<string, unknown>) =>
    apiCall<ApiResponse<Record<string, unknown>>>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiCall<ApiResponse<Record<string, unknown>>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/users/${id}`, {
      method: 'DELETE',
    }),
}

/**
 * Race/Schedule API endpoints (for Formula 1)
 */
export const raceAPI = {
  getUpcoming: () =>
    apiCall<ApiResponse<Record<string, unknown>[]>>('/races/upcoming'),

  getResults: (year?: number) =>
    apiCall<ApiResponse<Record<string, unknown>[]>>(
      `/races/results${year ? `?year=${year}` : ''}`
    ),

  getSchedule: (year?: number) =>
    apiCall<ApiResponse<Record<string, unknown>[]>>(
      `/races/schedule${year ? `?year=${year}` : ''}`
    ),
}

/**
 * Team API endpoints
 */
export const teamAPI = {
  getAll: () =>
    apiCall<ApiResponse<Record<string, unknown>[]>>('/teams'),

  getById: (id: string) =>
    apiCall<ApiResponse<Record<string, unknown>>>(`/teams/${id}`),

  getStandings: () =>
    apiCall<ApiResponse<Record<string, unknown>[]>>('/teams/standings'),
}

export default {
  userAPI,
  raceAPI,
  teamAPI,
}
