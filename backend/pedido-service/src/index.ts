import app from './app';
import { validateEnv } from './config/env';
import { dbPool, closePool } from '../shared/db';
import { redisClient, closeRedis } from '../shared/cache';
import { closeRabbitMQ } from './config/rabbitmq';

const config = validateEnv();
const PORT = config.PORT;

async function startServer(): Promise<void> {
  try {
    console.log('Testing database connection...');
    await dbPool.query('SELECT 1');
    console.log('Database connection successful');

    console.log('Connecting to Redis...');
    await redisClient.connect();
    console.log('Redis connection successful');

    const server = app.listen(PORT, () => {
      console.log(`Pedido service running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed');
        await closeRabbitMQ();
        console.log('RabbitMQ connection closed');
        await closeRedis();
        console.log('Redis connection closed');
        await closePool();
        console.log('Database pool closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();