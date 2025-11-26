import { Router } from 'express'
import { ViajeroController } from '../controllers/viajeroController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const viajeroRouter = Router()

// Rutas protegidas - para gestión de viajeros
viajeroRouter.use(authMiddleware) // Middleware para proteger las rutas siguientes
viajeroRouter.get('/', ViajeroController.listViajeros)
viajeroRouter.get('/:id_viajero', ViajeroController.getViajeroById)
viajeroRouter.get('/usuario/:usuario_asociado', ViajeroController.getViajerosByUsuario)
viajeroRouter.post('/', ViajeroController.createViajero)
viajeroRouter.put('/:id_viajero', ViajeroController.updateViajero)
viajeroRouter.delete('/:id_viajero', ViajeroController.deleteViajero)
