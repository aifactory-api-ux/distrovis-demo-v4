import { Router } from 'express';
import { createOrder, listOrders, getOrderById } from '../controllers/orderController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, listOrders);
router.get('/:id', requireAuth, getOrderById);

export default router;