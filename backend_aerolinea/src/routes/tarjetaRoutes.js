import { Router } from 'express'
import { TarjetaController } from '../controllers/tarjetaController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const tarjetaRoutes = Router()

tarjetaRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes

tarjetaRoutes.post('/', TarjetaController.create)
tarjetaRoutes.get('/:id', TarjetaController.getById)
tarjetaRoutes.put('/:id', TarjetaController.update)
tarjetaRoutes.delete('/:id', TarjetaController.delete)
tarjetaRoutes.get('/usuario/:usuarioId', TarjetaController.getByUsuarioId)
tarjetaRoutes.patch('/:id/aumentar-saldo', TarjetaController.aumentarSaldo)
tarjetaRoutes.patch('/:id/disminuir-saldo', TarjetaController.disminuirSaldo)
