/**
 * LocalLens Base API Client
 * Configured for seamless connection to a future FastAPI backend.
 * Falls back to local verified network topology when backend endpoints are offline.
 */

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'unavailable' | 'error';
  message?: string;
  provenance: 'scheduled_verified' | 'estimated' | 'community' | 'unavailable';
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public missingData?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = typeof window !== 'undefined' 
  ? (import.meta.env.VITE_API_URL || '/api/v1')
  : '/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Backend request failed: ${response.statusText}`
      );
    }
    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    // When backend server is not running, throw descriptive connection error
    throw new ApiError(
      503,
      'FastAPI backend service is currently not connected.',
      'Live server connection offline'
    );
  }
}
