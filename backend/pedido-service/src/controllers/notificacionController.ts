import { Request, Response, NextFunction } from 'express';
import * as notificacionService from '../services/notificacionService';
import { createError } from '../middleware/errorHandler';
import { validateBody, notificacionSchema } from '../utils/validator';

export async function getNotificaciones(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notificaciones = await notificacionService.getAllNotificaciones();
    res.status(200).json(notificaciones);
  } catch (error) {
    next(error);
  }
}

export async function getNotificacionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const notificacion = await notificacionService.getNotificacionById(id);
    if (!notificacion) {
      throw createError('Notificacion not found', 404);
    }
    res.status(200).json(notificacion);
  } catch (error) {
    next(error);
  }
}

export async function createNotificacion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = validateBody(notificacionSchema, req.body);
    const notificacion = await notificacionService.createNotificacion(data);
    res.status(201).json(notificacion);
  } catch (error) {
    next(error);
  }
}

export async function deleteNotificacion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const deleted = await notificacionService.deleteNotificacion(id);
    if (!deleted) {
      throw createError('Notificacion not found', 404);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}