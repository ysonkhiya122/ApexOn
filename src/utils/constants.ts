/**
 * Application Constants
 * Centralized place for all application-wide constants
 */

export const APP_NAME = 'ApexOn'
export const APP_VERSION = '0.0.0'
export const API_TIMEOUT = 5000

export const ROUTES = {
  HOME: '/',
  SCHEDULES: '/schedules',
  RESULTS: '/results',
  TEAMS: '/teams',
  DRIVERS: '/drivers',
  RULES: '/rules',
  HISTORY: '/history',
} as const

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 0.8,
} as const

export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  SUCCESS: '#10b981',
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

export const FORMULA_1 = {
  RACES_PER_SEASON: 24,
  PRACTICE_SESSIONS_PER_RACE: 3,
  QUALIFYING_ROUNDS: 3,
}

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const

export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
} as const
