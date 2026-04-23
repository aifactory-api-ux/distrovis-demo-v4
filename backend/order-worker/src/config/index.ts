import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.ORDER_WORKER_PORT || '8005'),
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
};