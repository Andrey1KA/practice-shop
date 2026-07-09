import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type { AuthUser, Product } from './types.js';

interface DbUserRow {
  id: string;
  email: string;
  login: string;
  password_hash: string;
  role: 'admin' | 'user';
  name: string;
}

interface DbProductRow {
  id: string;
  title: string;
  price: number;
  description: string;
  image_path: string | null;
}

export function initDb(databasePath: string, uploadsPath: string) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  fs.mkdirSync(uploadsPath, { recursive: true });

  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      login TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image_path TEXT
    );
  `);

  seedUsers(db);
  seedProducts(db);

  return db;
}

function seedUsers(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number };

  if (count.count > 0) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO users (id, email, login, password_hash, role, name)
    VALUES (@id, @email, @login, @password_hash, @role, @name)
  `);

  const defaults = [
    {
      id: randomUUID(),
      email: 'user@shop.local',
      login: 'user',
      password: 'user123',
      role: 'user' as const,
      name: 'Пользователь',
    },
    {
      id: randomUUID(),
      email: 'admin@shop.local',
      login: 'admin',
      password: '123',
      role: 'admin' as const,
      name: 'Администратор',
    },
  ];

  for (const user of defaults) {
    insert.run({
      id: user.id,
      email: user.email,
      login: user.login,
      password_hash: bcrypt.hashSync(user.password, 10),
      role: user.role,
      name: user.name,
    });
  }
}

function seedProducts(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number };

  if (count.count > 0) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products (id, title, price, description, image_path)
    VALUES (@id, @title, @price, @description, NULL)
  `);

  const defaults = [
    { id: '1', title: 'Товар 1', price: 990, description: 'Описание товара 1.' },
    { id: '2', title: 'Товар 2', price: 1490, description: 'Описание товара 2.' },
    { id: '3', title: 'Товар 3', price: 2290, description: 'Описание товара 3.' },
  ];

  for (const product of defaults) {
    insert.run(product);
  }
}

export function mapUser(row: DbUserRow): AuthUser {
  return {
    email: row.email,
    login: row.login,
    role: row.role,
    name: row.name,
  };
}

export function mapProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    description: row.description,
    image: row.image_path ?? undefined,
  };
}

export type ShopDatabase = Database.Database;
