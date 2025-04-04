import { User } from '@/types';
import { apiClient } from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// For demo purposes - hardcoded credentials
const DEMO_ADMIN = {
  email: 'admin@example.com',
  password: 'password123',
  user: {
    id: '1',
    email: 'admin@example.com',
    role: 'admin' as const,
  },
  token: 'demo-token-12345'
};

const DEMO_PLAYER = {
  email: 'player@example.com',
  password: 'password123',
  user: {
    id: '2',
    email: 'player@example.com',
    role: 'player' as const,
    playerId: '101',
  },
  token: 'demo-token-67890'
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // Simulated login for demo purposes
  if (credentials.email === DEMO_ADMIN.email && credentials.password === DEMO_ADMIN.password) {
    // Store the token for future requests
    localStorage.setItem('authToken', DEMO_ADMIN.token);
    localStorage.setItem('currentUser', JSON.stringify(DEMO_ADMIN.user));
    return { user: DEMO_ADMIN.user, token: DEMO_ADMIN.token };
  } 
  else if (credentials.email === DEMO_PLAYER.email && credentials.password === DEMO_PLAYER.password) {
    localStorage.setItem('authToken', DEMO_PLAYER.token);
    localStorage.setItem('currentUser', JSON.stringify(DEMO_PLAYER.user));
    return { user: DEMO_PLAYER.user, token: DEMO_PLAYER.token };
  }
  
  // If credentials don't match our demo users, throw an error
  throw new Error('Invalid credentials');
  
  /* Commented out real API call for now
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  // Store the token for future requests
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('currentUser', JSON.stringify(response.user));
  
  return response;
  */
}

export async function logout(): Promise<void> {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
}
