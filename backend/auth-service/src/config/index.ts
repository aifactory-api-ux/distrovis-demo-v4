import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.AUTH_SERVICE_PORT || '8001'),
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
};