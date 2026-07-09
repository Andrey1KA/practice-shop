import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { initDb } from './db.js';
import { createAuthRouter } from './routes/auth.js';
import { createProductsRouter } from './routes/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const dataDir = process.env.DATA_DIR ?? path.resolve(__dirname, '../data');
const databasePath = process.env.DATABASE_PATH ?? path.join(dataDir, 'shop.db');
const uploadsPath = process.env.UPLOADS_PATH ?? path.join(dataDir, 'uploads');

const db = initDb(databasePath, uploadsPath);
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));
app.use('/api/auth', createAuthRouter(db, jwtSecret));
app.use('/api/products', createProductsRouter(db, jwtSecret, uploadsPath));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
