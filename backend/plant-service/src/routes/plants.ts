import { Router } from 'express';
import { listPlants } from '../controllers/plantController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, listPlants);

export default router;