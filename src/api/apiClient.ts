
import { toast } from "@/hooks/use-toast";

// Base URL for API calls - change this to your real API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.karensbarswinglegolf.com';

// Mock data for demo purposes
const mockData = {
  players: [],
  games: [],
  scores: [],
  photos: []
};

/**
 * Generic API client with error handling
 */
export async function apiClient<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  // For demo purposes, simulate API responses
  if (endpoint.startsWith('/players')) {
    return mockData.players as unknown as T;
  }
  if (endpoint.startsWith('/games')) {
    return mockData.games as unknown as T;
  }
  if (endpoint.startsWith('/scores')) {
    return mockData.scores as unknown as T;
  }
  if (endpoint.startsWith('/photos')) {
    return mockData.photos as unknown as T;
  }

  // Real API logic (currently unused for demo)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      
      console.error("API Error:", errorMessage);
      
      // Return null instead of throwing error
      return null as unknown as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    // Return null instead of throwing error
    return null as unknown as T;
  }
}

// Add auth token to requests if user is logged in
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
