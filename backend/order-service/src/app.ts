import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/orders';
import kpiRoutes from './routes/kpi';

export const startServer = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'order-service' });
  });

  app.use('/orders', orderRoutes);
  app.use('/kpi', kpiRoutes);

  app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
  });

  return app;
};