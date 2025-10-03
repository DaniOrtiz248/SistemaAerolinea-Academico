import { Router } from 'express'
import { FlightController } from '../controllers/flightController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const flightRoutes = Router()

// Rutas públicas - para búsqueda de vuelos
flightRoutes.get('/', FlightController.listFlights)
flightRoutes.get('/search', FlightController.searchFlights)
flightRoutes.get('/:ccv', FlightController.getFlightById)

// Rutas protegidas - para administración de vuelos
flightRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
flightRoutes.post('/', FlightController.createFlight)