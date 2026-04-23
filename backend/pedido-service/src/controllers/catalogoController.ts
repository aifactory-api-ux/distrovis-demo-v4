import { Request, Response, NextFunction } from 'express';
import * as catalogoService from '../services/catalogoService';
import { Catalogo } from '../../../shared/models';
import { createError } from '../middleware/errorHandler';
import { validateBody, catalogoSchema, catalogoUpdateSchema } from '../utils/validator';

export async function getCatalogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const catalogo = await catalogoService.getAllCatalogo();
    res.status(200).json(catalogo);
  } catch (error) {
    next(error);
  }
}

export async function getCatalogoById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const catalogo = await catalogoService.getCatalogoById(id);
    if (!catalogo) {
      throw createError('Catalogo not found', 404);
    }
    res.status(200).json(catalogo);
  } catch (error) {
    next(error);
  }
}

export async function createCatalogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = validateBody(catalogoSchema, req.body);
    const catalogo = await catalogoService.createCatalogo(data);
    res.status(201).json(catalogo);
  } catch (error) {
    next(error);
  }
}

export async function updateCatalogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const data = validateBody(catalogoUpdateSchema, req.body);
    const catalogo = await catalogoService.updateCatalogo(id, data);
    if (!catalogo) {
      throw createError('Catalogo not found', 404);
    }
    res.status(200).json(catalogo);
  } catch (error) {
    next(error);
  }
}

export async function deleteCatalogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const deleted = await catalogoService.deleteCatalogo(id);
    if (!deleted) {
      throw createError('Catalogo not found', 404);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}