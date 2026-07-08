import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getMockUsers } from '../data/mockUsers';
import type { AuthUser, RegisteredUser } from '../types/auth';
import type { RootState } from './store';

interface AuthState {
  user: AuthUser | null;
  users: RegisteredUser[];
}

const initialState: AuthState = {
  user: null,
  users: getMockUsers(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = {
        email: action.payload.email,
        login: action.payload.login,
        role: action.payload.role,
        name: action.payload.name,
      };
    },
    registerUser: (state, action: PayloadAction<RegisteredUser>) => {
      state.users.push(action.payload);
      state.user = {
        email: action.payload.email,
        login: action.payload.login,
        role: action.payload.role,
        name: action.payload.name,
      };
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginUser, logout, registerUser } = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectRegisteredUsers = (state: RootState) => state.auth.users;
export const selectUserRole = (state: RootState) => state.auth.user?.role ?? null;

export const authReducer = authSlice.reducer;
