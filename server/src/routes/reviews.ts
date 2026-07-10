import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import type { ShopDatabase } from '../db.js';
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth.js';

interface DbReviewRow {
  id: string;
  product_id: string;
  user_login: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface DbProductRow {
  id: string;
}

export interface Review {
  id: string;
  productId: string;
  userLogin: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function mapReview(row: DbReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userLogin: row.user_login,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export function createReviewsRouter(db: ShopDatabase, jwtSecret: string) {
  const router = Router({ mergeParams: true });
  const authMiddleware = createAuthMiddleware(jwtSecret);

  router.get('/', (req, res) => {
    const productId = String((req.params as { productId: string }).productId);
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId) as DbProductRow | undefined;

    if (!product) {
      res.status(404).json({ message: 'Товар не найден' });
      return;
    }

    const rows = db.prepare(`
      SELECT * FROM reviews
      WHERE product_id = ?
      ORDER BY datetime(created_at) DESC
    `).all(productId) as DbReviewRow[];

    res.json(rows.map(mapReview));
  });

  router.post('/', authMiddleware, (req: AuthRequest, res) => {
    const productId = String((req.params as { productId: string }).productId);
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId) as DbProductRow | undefined;

    if (!product) {
      res.status(404).json({ message: 'Товар не найден' });
      return;
    }

    const rating = Number(req.body.rating);
    const comment = String(req.body.comment ?? '').trim();
    const userLogin = req.user?.login ?? '';

    if (!comment || Number.isNaN(rating) || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Укажите оценку от 1 до 5 и комментарий' });
      return;
    }

    const existing = db.prepare(`
      SELECT id FROM reviews WHERE product_id = ? AND user_login = ?
    `).get(productId, userLogin) as { id: string } | undefined;

    if (existing) {
      db.prepare(`
        UPDATE reviews
        SET rating = ?, comment = ?, created_at = ?
        WHERE id = ?
      `).run(rating, comment, new Date().toISOString(), existing.id);

      const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(existing.id) as DbReviewRow;
      res.json(mapReview(row));
      return;
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_login, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, productId, userLogin, rating, comment, createdAt);

    const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) as DbReviewRow;
    res.status(201).json(mapReview(row));
  });

  return router;
}
