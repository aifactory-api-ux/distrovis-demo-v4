import { Pool } from 'pg';
import Redis from 'ioredis';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'distroviz',
  user: process.env.POSTGRES_USER || 'distroviz_user',
  password: process.env.POSTGRES_PASSWORD || 'supersecret',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const getDbConnection = () => pool;

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
    });
  }
  return redisClient;
};

export const closeConnections = async () => {
  await pool.end();
  if (redisClient) {
    await redisClient.quit();
  }
};