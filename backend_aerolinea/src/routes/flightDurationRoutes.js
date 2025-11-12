import express from 'express';
import flightDurationController from '../controllers/flightDurationController.js';

const router = express.Router();

// GET - Obtener duración entre dos ciudades
router.get('/duration', flightDurationController.getDuration);

// POST - Calcular hora de llegada
router.post('/calculate-arrival', flightDurationController.calculateArrival);

export default router;
