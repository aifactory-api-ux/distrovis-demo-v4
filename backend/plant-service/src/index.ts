import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from '../../shared/config';
import { startServer } from './app';

validateEnv();

const PORT = parseInt(process.env.PLANT_SERVICE_PORT || '8003');

startServer(PORT);