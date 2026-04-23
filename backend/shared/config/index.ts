import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  postgres: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
  };
  rabbitmq: {
    host: string;
    port: number;
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  services: {
    auth: number;
    order: number;
    plant: number;
    distribution: number;
    worker: number;
  };
}

const requiredEnvVars = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'REDIS_HOST',
  'REDIS_PORT',
  'RABBITMQ_HOST',
  'RABBITMQ_PORT',
  'JWT_SECRET',
];

export const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'distroviz',
    user: process.env.POSTGRES_USER || 'distroviz_user',
    password: process.env.POSTGRES_PASSWORD || 'supersecret',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672'),
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultsecret',
    expiresIn: '24h',
  },
  services: {
    auth: parseInt(process.env.AUTH_SERVICE_PORT || '8001'),
    order: parseInt(process.env.ORDER_SERVICE_PORT || '8002'),
    plant: parseInt(process.env.PLANT_SERVICE_PORT || '8003'),
    distribution: parseInt(process.env.DISTRIBUTION_SERVICE_PORT || '8004'),
    worker: parseInt(process.env.ORDER_WORKER_PORT || '8005'),
  },
};