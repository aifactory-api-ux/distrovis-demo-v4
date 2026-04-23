import { Router } from 'express';
import * as notificacionController from '../controllers/notificacionController';

const router = Router();

router.get('/', notificacionController.getNotificaciones);
router.get('/:id', notificacionController.getNotificacionById);
router.post('/', notificacionController.createNotificacion);
router.delete('/:id', notificacionController.deleteNotificacion);

export default router;