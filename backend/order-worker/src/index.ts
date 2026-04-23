import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from '../../shared/config';
import { startOrderConsumer } from './worker/orderConsumer';
import express from 'express';

validateEnv();

const PORT = parseInt(process.env.ORDER_WORKER_PORT || '8005');

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-worker' });
});

app.listen(PORT, () => {
  console.log(`Order worker health check listening on port ${PORT}`);
});

startOrderConsumer()
  .then(() => {
    console.log('Order worker started successfully');
  })
  .catch((error) => {
    console.error('Failed to start order worker:', error);
    process.exit(1);
  });