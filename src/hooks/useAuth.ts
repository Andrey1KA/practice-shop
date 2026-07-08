import { useCallback } from 'react';
import { saveMockUsers } from '../data/mockUsers';
import {
  loginUser,
  logout as logoutUser,
  registerUser,
  selectAuthUser,
  selectIsAuthenticated,
  selectRegisteredUsers,
  selectUserRole,
} from '../store/authSlice';
import { useAppDispatch, useAppSelector } from './useStore';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const users = useAppSelector(selectRegisteredUsers);
  const role = useAppSelector(selectUserRole);

  const register = useCallback(
    (email: string, login: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedLogin = login.trim().toLowerCase();
      const isUserTaken = users.some(
        (registeredUser) =>
          registeredUser.email === normalizedEmail || registeredUser.login === normalizedLogin,
      );

      if (isUserTaken) {
        return false;
      }

      const newUser = {
        email: normalizedEmail,
        login: normalizedLogin,
        password,
        role: 'user',
        name: 'Пользователь',
      } as const;

      dispatch(registerUser(newUser));
      saveMockUsers([...users, newUser]);
      return true;
    },
    [dispatch, users],
  );

  const login = useCallback(
    (loginOrEmail: string, password: string) => {
      const normalizedLoginOrEmail = loginOrEmail.trim().toLowerCase();
      const registeredUser = users.find(
        (storedUser) =>
          (storedUser.email === normalizedLoginOrEmail || storedUser.login === normalizedLoginOrEmail) &&
          storedUser.password === password,
      );

      if (!registeredUser) {
        return false;
      }

      dispatch(loginUser({
        email: registeredUser.email,
        login: registeredUser.login,
        role: registeredUser.role,
        name: registeredUser.name,
      }));
      return true;
    },
    [dispatch, users],
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    user,
    role,
    isAuthenticated,
    login,
    logout,
    register,
    users,
  };
}
