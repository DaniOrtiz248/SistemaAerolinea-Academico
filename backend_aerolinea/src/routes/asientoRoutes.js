import { Router } from 'express'
import { AsientoController } from '../controllers/asientoController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const asientoRoutes = Router()

asientoRoutes.use(authMiddleware) // Proteger las rutas siguientes

asientoRoutes.get('/:vueloId', AsientoController.getAll)
asientoRoutes.put('/:id', AsientoController.update)
