import { Router } from 'express'
import { RouteController } from '../controllers/routeController.js'
// import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js'

export const routeRoutes = Router()

// routeRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
// routeRoutes.use(adminMiddleware)

routeRoutes.post('/create', RouteController.create)
// routeRoutes.get('/', RouteController.getAll)
// routeRoutes.put('/:id', RouteController.update)
// routeRoutes.delete('/:id', RouteController.delete)
// routeRoutes.get('/:id', RouteController.getById)
