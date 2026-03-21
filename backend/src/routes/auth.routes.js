import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export function authRoutes() {
  const r = Router();
  r.post('/register', auth.register);
  r.post('/login', auth.login);
  r.get('/me', authMiddleware, auth.me);
  r.post('/change-password', authMiddleware, auth.changePassword);
  return r;
}
