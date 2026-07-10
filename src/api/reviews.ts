import { apiFetch } from './client';
import type { Review } from '../types/review';

export function fetchReviews(productId: string) {
  return apiFetch<Review[]>(`/api/products/${productId}/reviews`);
}

export function createReviewRequest(productId: string, rating: number, comment: string) {
  return apiFetch<Review>(`/api/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  });
}
