import { Router } from 'express';
import { getKPI } from '../controllers/kpiController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getKPI);

export default router;