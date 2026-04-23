import { Router } from 'express';
import { listDistributionCenters } from '../controllers/distributionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, listDistributionCenters);

export default router;