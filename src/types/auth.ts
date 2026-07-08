export type UserRole = 'admin' | 'user';

export interface AuthUser {
  email: string;
  login: string;
  role: UserRole;
  name: string;
}

export interface RegisteredUser extends AuthUser {
  password: string;
}
