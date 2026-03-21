import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalUserAuth } from '../middleware/optionalUserAuth.js';
import * as orders from '../controllers/orderController.js';

export function orderRoutes() {
  const r = Router();
  r.get('/orders/my', authMiddleware, orders.listMyOrders);
  r.get('/orders/:orderId', authMiddleware, orders.getOrderById);
  r.post('/orders/lookup', orders.lookupOrder);
  r.post('/orders', optionalUserAuth, orders.createOrder);
  return r;
}
