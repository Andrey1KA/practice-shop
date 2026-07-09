import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../types.js';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function createAuthMiddleware(jwtSecret: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Требуется авторизация' });
      return;
    }

    const token = header.slice('Bearer '.length);

    try {
      req.user = jwt.verify(token, jwtSecret) as AuthUser;
      next();
    } catch {
      res.status(401).json({ message: 'Недействительный токен' });
    }
  };
}

export function createAdminMiddleware() {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Доступ только для администратора' });
      return;
    }

    next();
  };
}
