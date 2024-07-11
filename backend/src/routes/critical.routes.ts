import express from 'express';
import CriticalController from '../controllers/critical.controller';
import CriticalService from '../services/critical.service';

const router = express.Router();

const criticalService = new CriticalService();
const criticalController = new CriticalController(criticalService);
router.get('/', (req, res) => criticalController.getCritical(req, res));

router.get('/all', (req, res) => criticalController.getAllCritical(req, res));

router.get('/:id', (req, res) => criticalController.getCriticalById(req, res));

router.post('/', (req, res) => criticalController.createCritical(req, res));

router.put('/:id', (req, res) => criticalController.updateCritical(req, res));

router.delete('/:id', (req, res) => criticalController.deleteCritical(req, res));

export default router;
