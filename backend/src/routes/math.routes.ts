import express from 'express'
import MathController from '../controllers/math.controller'
import MathService from '../services/math.service'
const router = express.Router()

const mathService = new MathService()
const mathController = new MathController(mathService)

router.get('/', (req, res) => mathController.getMath(req, res))

router.get('/all', (req, res) => mathController.getAllMath(req, res));

// GET math data by ID
router.get('/:id', (req, res) => mathController.getMathById(req, res));

// CREATE new math data
router.post('/', (req, res) => mathController.createMath(req, res));

// UPDATE math data by ID
router.put('/:id', (req, res) => mathController.updateMath(req, res));

// DELETE math data by ID
router.delete('/:id', (req, res) => mathController.deleteMath(req, res));

export default router