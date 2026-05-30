/**
 * Generic API response wrapper for future internal API endpoints.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Generic paginated API response wrapper for future internal API endpoints.
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
