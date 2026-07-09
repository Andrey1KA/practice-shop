import fs from 'node:fs';
import path from 'node:path';
import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import type { ShopDatabase } from '../db.js';
import { mapProduct } from '../db.js';
import { createAdminMiddleware, createAuthMiddleware } from '../middleware/auth.js';

interface DbProductRow {
  id: string;
  title: string;
  price: number;
  description: string;
  image_path: string | null;
}

export function createProductsRouter(db: ShopDatabase, jwtSecret: string, uploadsPath: string) {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtSecret);
  const adminMiddleware = createAdminMiddleware();

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsPath);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname) || '.jpg';
      cb(null, `${randomUUID()}${extension}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  router.get('/', (_req, res) => {
    const rows = db.prepare(`
      SELECT * FROM products ORDER BY rowid DESC
    `).all() as DbProductRow[];

    res.json(rows.map(mapProduct));
  });

  router.post('/', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
    const title = String(req.body.title ?? '').trim();
    const description = String(req.body.description ?? '').trim();
    const price = Number(req.body.price);

    if (!title || !description || Number.isNaN(price) || price <= 0) {
      res.status(400).json({ message: 'Заполните название, описание и корректную цену' });
      return;
    }

    const id = randomUUID();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    db.prepare(`
      INSERT INTO products (id, title, price, description, image_path)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, price, description, imagePath);

    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as DbProductRow;

    res.status(201).json(mapProduct(row));
  });

  router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as DbProductRow | undefined;

    if (!row) {
      res.status(404).json({ message: 'Товар не найден' });
      return;
    }

    if (row.image_path?.startsWith('/uploads/')) {
      const filePath = path.join(uploadsPath, path.basename(row.image_path));

      try {
        fs.unlinkSync(filePath);
      } catch {
      }
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.status(204).send();
  });

  router.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      res.status(400).json({ message: 'Файл слишком большой' });
      return;
    }

    next(error);
  });

  return router;
}
