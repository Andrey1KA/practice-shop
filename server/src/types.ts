export type UserRole = 'admin' | 'user';

export interface AuthUser {
  email: string;
  login: string;
  role: UserRole;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
}
