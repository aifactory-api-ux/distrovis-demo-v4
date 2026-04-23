import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PLANT_SERVICE_PORT || '8003'),
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
};