
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

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  // Store the token for future requests
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('currentUser', JSON.stringify(response.user));
  
  return response;
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
