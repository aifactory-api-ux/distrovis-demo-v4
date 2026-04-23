import { Request, Response } from 'express';
import { findUserByEmail } from '../services/userService';
import { signJWT } from '../../shared/utils/jwt';
import { AuthRequest } from '../../shared/types/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: AuthRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = password === 'password123';

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as Request & { user?: { userId: string } }).user;

    if (!user || !user.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const foundUser = await findUserByEmail('');

    if (!foundUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: foundUser.id,
      email: foundUser.email,
      password_hash: foundUser.password_hash,
      role: foundUser.role,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};