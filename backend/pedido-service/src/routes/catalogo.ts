import { Router } from 'express';
import * as catalogoController from '../controllers/catalogoController';

const router = Router();

router.get('/', catalogoController.getCatalogo);
router.get('/:id', catalogoController.getCatalogoById);
router.post('/', catalogoController.createCatalogo);
router.put('/:id', catalogoController.updateCatalogo);
router.delete('/:id', catalogoController.deleteCatalogo);

export default router;