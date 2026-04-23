import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

export const startServer = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-service' });
  });

  app.use('/auth', authRoutes);

  app.listen(port, () => {
    console.log(`Auth service listening on port ${port}`);
  });

  return app;
};