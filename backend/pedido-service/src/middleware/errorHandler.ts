import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details;

  res.status(statusCode).json({
    error: {
      message,
      details,
      statusCode,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
}

export function createError(message: string, statusCode: number, details?: string): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}