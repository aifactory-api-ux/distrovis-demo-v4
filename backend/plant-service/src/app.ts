import express from 'express';
import cors from 'cors';
import plantRoutes from './routes/plants';

export const startServer = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'plant-service' });
  });

  app.use('/plants', plantRoutes);

  app.listen(port, () => {
    console.log(`Plant service listening on port ${port}`);
  });

  return app;
};