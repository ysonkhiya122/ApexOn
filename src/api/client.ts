/**
 * APexOn API Client Abstraction
 * 
 * This layer abstracts all external API calls for future backend proxy integration.
 * Currently points directly to external APIs, but can be switched to internal backend.
 */

import type { ApiResponse } from './types';

const API_CONFIG = {
  jolpica: {
    baseUrl: import.meta.env.VITE_JOLPICA_BASE_URL || 'https://api.jolpi.ca/ergast/f1',
    timeout: 10000,
    retries: 2,
  },
  openf1: {
    baseUrl: import.meta.env.VITE_OPENF1_BASE_URL || 'https://api.openf1.org/v1',
    timeout: 10000,
    retries: 2,
  },
};

export type ApiSource = 'jolpica' | 'openf1';

class ApiClient {
  private source: ApiSource;

  constructor(source: ApiSource) {
    this.source = source;
  }

  private getBaseUrl(): string {
    return API_CONFIG[this.source].baseUrl;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.getBaseUrl()}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG[this.source].timeout);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        meta: {
          timestamp: new Date().toISOString(),
          source: this.source,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${API_CONFIG[this.source].timeout}ms`);
      }
      
      throw error;
    }
  }
}

export const jolpicaClient = new ApiClient('jolpica');
export const openF1Client = new ApiClient('openf1');

export default ApiClient;
