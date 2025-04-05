
import { toast } from "@/hooks/use-toast";
import { mockPlayers, mockGames, mockScores, mockPhotos, mockWeather } from "@/data/mockData";

// Base URL for API calls - change this to your real API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.karensbarswinglegolf.com';

/**
 * Generic API client with error handling and MOCK responses for demo
 */
export async function apiClient<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  // Add a slight delay to simulate network latency (important for testing loading states)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For demo purposes, simulate API responses
  if (endpoint.startsWith('/players')) {
    // Handle player CRUD operations with proper mocking 
    const method = options.method?.toUpperCase() || 'GET';
    
    // Check if it's a specific player operation
    const idMatch = endpoint.match(/\/players\/([^\/]+)/);
    const playerId = idMatch ? idMatch[1] : null;
    
    if (method === 'POST') {
      // Create player
      const playerData = options.body ? JSON.parse(options.body.toString()) : {};
      const newPlayer = {
        id: Date.now().toString(),
        ...playerData
      };
      return newPlayer as unknown as T;
    } 
    else if (method === 'PUT' && playerId) {
      // Update player
      const playerData = options.body ? JSON.parse(options.body.toString()) : {};
      const existingPlayer = mockPlayers.find(p => p.id === playerId);
      if (!existingPlayer) {
        throw new Error(`Player with ID ${playerId} not found`);
      }
      const updatedPlayer = {
        ...existingPlayer,
        ...playerData
      };
      return updatedPlayer as unknown as T;
    }
    else if (method === 'DELETE' && playerId) {
      // Delete player - just return success
      return true as unknown as T;
    }
    else {
      // Regular GET request
      if (playerId) {
        const player = mockPlayers.find(p => p.id === playerId);
        return (player || null) as unknown as T;
      }
      return mockPlayers as unknown as T;
    }
  }
  if (endpoint.startsWith('/games')) {
    return mockGames as unknown as T;
  }
  if (endpoint.startsWith('/scores')) {
    return mockScores as unknown as T;
  }
  if (endpoint.startsWith('/photos')) {
    return mockPhotos as unknown as T;
  }
  if (endpoint.startsWith('/weather')) {
    return mockWeather as unknown as T;
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
