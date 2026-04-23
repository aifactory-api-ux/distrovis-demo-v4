import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.ORDER_SERVICE_PORT || '8002'),
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
};