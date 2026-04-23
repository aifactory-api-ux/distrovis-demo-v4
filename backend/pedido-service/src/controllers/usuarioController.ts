import { Request, Response, NextFunction } from 'express';
import * as usuarioService from '../services/usuarioService';
import { createError } from '../middleware/errorHandler';
import { validateBody, usuarioSchema, usuarioUpdateSchema } from '../utils/validator';

export async function getUsuarios(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function getUsuarioById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario) {
      throw createError('Usuario not found', 404);
    }
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function createUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = validateBody(usuarioSchema, req.body);
    const usuario = await usuarioService.createUsuario(data);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function updateUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const data = validateBody(usuarioUpdateSchema, req.body);
    const usuario = await usuarioService.updateUsuario(id, data);
    if (!usuario) {
      throw createError('Usuario not found', 404);
    }
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function deleteUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createError('Invalid id parameter', 400);
    }
    const deleted = await usuarioService.deleteUsuario(id);
    if (!deleted) {
      throw createError('Usuario not found', 404);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}