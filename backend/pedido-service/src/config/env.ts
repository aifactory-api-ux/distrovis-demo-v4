import * as dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  RABBITMQ_HOST: string;
  RABBITMQ_PORT: number;
  RABBITMQ_USER: string;
  RABBITMQ_PASSWORD: string;
}

const requiredVars: (keyof EnvConfig)[] = [
  'NODE_ENV',
  'PORT',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'REDIS_HOST',
  'REDIS_PORT',
  'RABBITMQ_HOST',
  'RABBITMQ_PORT',
  'RABBITMQ_USER',
  'RABBITMQ_PASSWORD',
];

export function validateEnv(): EnvConfig {
  const config: EnvConfig = {} as EnvConfig;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value === undefined || value === '') {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
    if (varName === 'PORT' || varName === 'POSTGRES_PORT' || varName === 'REDIS_PORT' || varName === 'RABBITMQ_PORT') {
      config[varName] = parseInt(value, 10);
    } else {
      config[varName] = value as any;
    }
  }

  if (process.env.REDIS_PASSWORD) {
    config.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
  }

  return config;
}

export const envConfig = validateEnv();