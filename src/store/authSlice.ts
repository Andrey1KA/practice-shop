import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../types/auth';
import type { RootState } from './store';

const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'token';
const AUTH_PASSWORD_KEY = 'auth_password';

function loadStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser || !localStorage.getItem(AUTH_TOKEN_KEY)) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

function loadStoredPassword(): string {
  if (typeof localStorage === 'undefined') {
    return '';
  }

  return localStorage.getItem(AUTH_PASSWORD_KEY) ?? '';
}

function persistAuth(user: AuthUser | null, token?: string, password?: string) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (!user || !token) {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_PASSWORD_KEY);
    return;
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  if (password) {
    localStorage.setItem(AUTH_PASSWORD_KEY, password);
  }
}

interface AuthState {
  user: AuthUser | null;
  password: string;
}

const initialState: AuthState = {
  user: loadStoredUser(),
  password: loadStoredPassword(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ user: AuthUser; token: string; password?: string }>) => {
      state.user = action.payload.user;
      state.password = action.payload.password ?? state.password;
      persistAuth(action.payload.user, action.payload.token, action.payload.password);
    },
    logout: (state) => {
      state.user = null;
      state.password = '';
      persistAuth(null);
    },
  },
});

export const { loginUser, logout } = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthPassword = (state: RootState) => state.auth.password;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectUserRole = (state: RootState) => state.auth.user?.role ?? null;

export const authReducer = authSlice.reducer;
