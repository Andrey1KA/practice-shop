import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import type { ShopDatabase } from '../db.js';
import { mapUser } from '../db.js';
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth.js';
import type { AuthUser } from '../types.js';

interface DbUserRow {
  id: string;
  email: string;
  login: string;
  password_hash: string;
  role: 'admin' | 'user';
  name: string;
}

function createToken(user: AuthUser, jwtSecret: string) {
  return jwt.sign(user, jwtSecret, { expiresIn: '7d' });
}

export function createAuthRouter(db: ShopDatabase, jwtSecret: string) {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtSecret);

  router.post('/register', (req, res) => {
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const login = String(req.body.login ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');

    if (!email || !login || !password) {
      res.status(400).json({ message: 'Введите email, логин и пароль' });
      return;
    }

    const existing = db.prepare(`
      SELECT id FROM users WHERE email = ? OR login = ?
    `).get(email, login) as { id: string } | undefined;

    if (existing) {
      res.status(409).json({ message: 'Пользователь с таким email или логином уже зарегистрирован' });
      return;
    }

    const user: AuthUser = {
      email,
      login,
      role: 'user',
      name: 'Пользователь',
    };

    db.prepare(`
      INSERT INTO users (id, email, login, password_hash, role, name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), email, login, bcrypt.hashSync(password, 10), user.role, user.name);

    res.status(201).json({
      user,
      token: createToken(user, jwtSecret),
    });
  });

  router.post('/login', (req, res) => {
    const loginOrEmail = String(req.body.loginOrEmail ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');

    if (!loginOrEmail || !password) {
      res.status(400).json({ message: 'Введите почту или логин и пароль' });
      return;
    }

    const row = db.prepare(`
      SELECT * FROM users WHERE email = ? OR login = ?
    `).get(loginOrEmail, loginOrEmail) as DbUserRow | undefined;

    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      res.status(401).json({ message: 'Неверно заполнена почта или пароль' });
      return;
    }

    const user = mapUser(row);

    res.json({
      user,
      token: createToken(user, jwtSecret),
    });
  });

  router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  return router;
}
