import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.DISTRIBUTION_SERVICE_PORT || '8004'),
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
};