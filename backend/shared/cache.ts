import redis from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD;

export const redisClient = redis.createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
  password: redisPassword || undefined,
  legacyMode: false,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

export async function getCache(key: string): Promise<any | null> {
  const value = await redisClient.get(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return null;
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await redisClient.setEx(key, ttl, stringValue);
}

export async function deleteCache(key: string): Promise<void> {
  await redisClient.del(key);
}

export async function closeRedis(): Promise<void> {
  await redisClient.quit();
}