import { apiFetch } from './client';
import type { AuthUser } from '../types/auth';

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export function loginRequest(loginOrEmail: string, password: string) {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ loginOrEmail, password }),
  });
}

export function registerRequest(email: string, login: string, password: string) {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, login, password }),
  });
}

export function fetchCurrentUser() {
  return apiFetch<{ user: AuthUser }>('/api/auth/me');
}
