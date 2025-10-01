import { Router } from 'express'
import { FlightController } from '../controllers/flightController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const flightRoutes = Router()

flightRoutes.post('/create-flight', FlightController.create)