import express from 'express';
import cors from 'cors';
import distributionCenterRoutes from './routes/distributionCenters';

export const startServer = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'distribution-service' });
  });

  app.use('/distribution-centers', distributionCenterRoutes);

  app.listen(port, () => {
    console.log(`Distribution service listening on port ${port}`);
  });

  return app;
};