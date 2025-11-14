import { Router } from 'express'
import { ViajeroController } from '../controllers/viajeroController.js'

export const viajeroRouter = Router()

viajeroRouter.get('/', ViajeroController.listViajeros)
viajeroRouter.get('/:id_viajero', ViajeroController.getViajeroById)
viajeroRouter.get('/usuario/:usuario_asociado', ViajeroController.getViajerosByUsuario)
viajeroRouter.post('/', ViajeroController.createViajero)
viajeroRouter.put('/:id_viajero', ViajeroController.updateViajero)
viajeroRouter.delete('/:id_viajero', ViajeroController.deleteViajero)
