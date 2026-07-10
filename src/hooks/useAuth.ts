import { useCallback } from 'react';
import { ApiError } from '../api/client';
import { loginRequest, registerRequest } from '../api/auth';
import {
  loginUser,
  logout as logoutUser,
  selectAuthPassword,
  selectAuthUser,
  selectIsAuthenticated,
  selectUserRole,
} from '../store/authSlice';
import { useAppDispatch, useAppSelector } from './useStore';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const password = useAppSelector(selectAuthPassword);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);

  const register = useCallback(
    async (email: string, login: string, password: string) => {
      try {
        const response = await registerRequest(email, login, password);
        dispatch(loginUser({ ...response, password }));
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return false;
        }

        throw error;
      }
    },
    [dispatch],
  );

  const login = useCallback(
    async (loginOrEmail: string, password: string) => {
      try {
        const response = await loginRequest(loginOrEmail, password);
        dispatch(loginUser({ ...response, password }));
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }

        throw error;
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    user,
    password,
    role,
    isAuthenticated,
    login,
    logout,
    register,
  };
}
