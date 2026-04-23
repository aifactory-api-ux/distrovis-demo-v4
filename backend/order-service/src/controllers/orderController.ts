import { Request, Response } from 'express';
import { insertOrder, fetchOrders, fetchOrderById } from '../services/orderService';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateOrderRequest } from '../../shared/types/auth';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const body: CreateOrderRequest = req.body;

    if (!body.plant_id || !body.distribution_center_id || !body.items || body.items.length === 0) {
      res.status(400).json({ error: 'plant_id, distribution_center_id, and items are required' });
      return;
    }

    for (const item of body.items) {
      if (!item.product_name || item.quantity <= 0 || item.unit_price < 0) {
        res.status(400).json({ error: 'Each item must have product_name, quantity > 0, and unit_price >= 0' });
        return;
      }
    }

    const order = await insertOrder(userId, body.plant_id, body.distribution_center_id, body.items);

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const plantId = req.query.plant_id as string | undefined;
    const status = req.query.status as string | undefined;

    const orders = await fetchOrders(plantId, status);

    res.json({ orders });
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const order = await fetchOrderById(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};