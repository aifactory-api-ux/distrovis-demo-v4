import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../shared/utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'operator' | 'viewer';
  };
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    const payload = verifyJWT(token);

    (req as AuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};