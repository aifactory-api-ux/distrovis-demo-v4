import { Request, Response, NextFunction } from 'express';
import * as pedidoService from '../services/pedidoService';
import { createError } from '../middleware/errorHandler';
import { validateBody, pedidoSchema, pedidoUpdateSchema } from '../utils/validator';

export async function getPedidos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pedidos = await pedidoService.getAllPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  }
}

export async function getPedidoById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const pedido = await pedidoService.getPedidoById(id);
    if (!pedido) {
      throw createError('Pedido not found', 404);
    }
    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
}

export async function createPedido(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = validateBody(pedidoSchema, req.body);
    const pedido = await pedidoService.createPedido(data);
    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
}

export async function updatePedido(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const data = validateBody(pedidoUpdateSchema, req.body);
    const pedido = await pedidoService.updatePedido(id, data);
    if (!pedido) {
      throw createError('Pedido not found', 404);
    }
    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
}

export async function deletePedido(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const deleted = await pedidoService.deletePedido(id);
    if (!deleted) {
      throw createError('Pedido not found', 404);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}