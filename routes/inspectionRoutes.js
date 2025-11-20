// routes/inspectionRoutes.js
import express from 'express';
import inspectionController from '../controllers/inspectionController.js';

const router = express.Router();

// CRUD de base
router.get('/', inspectionController.getAll);
router.get('/:id', inspectionController.getById);
router.post('/', inspectionController.create);
router.put('/:id', inspectionController.update);
router.delete('/:id', inspectionController.remove);

export default router;
