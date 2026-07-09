import { apiFetch } from './client';
import type { Product } from '../types/product';

export function fetchProducts() {
  return apiFetch<Product[]>('/api/products');
}

export function createProductRequest(payload: FormData) {
  return apiFetch<Product>('/api/products', {
    method: 'POST',
    body: payload,
  });
}

export function deleteProductRequest(id: string) {
  return apiFetch<void>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}
