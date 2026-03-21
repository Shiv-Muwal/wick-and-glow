import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as cart from '../controllers/cartController.js';

export function cartRoutes() {
  const r = Router();
  r.use(authMiddleware);
  r.get('/', cart.getCart);
  r.post('/items', cart.addCartItem);
  r.patch('/items/:productId', cart.updateCartItem);
  r.delete('/items/:productId', cart.removeCartItem);
  return r;
}
