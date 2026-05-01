// Common types for the application

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}
