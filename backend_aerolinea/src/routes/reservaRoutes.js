import { Router } from 'express'
import { ReservaController } from '../controllers/reservaController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const reservaRoutes = Router()

// Rutas protegidas - para gestión de reservas
reservaRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
reservaRoutes.post('/', ReservaController.create)
reservaRoutes.post('/send-confirmation-email', ReservaController.sendConfirmationEmail)
reservaRoutes.get('/:id', ReservaController.getReservaById)
reservaRoutes.put('/:id', ReservaController.update)
reservaRoutes.delete('/:id', ReservaController.delete)
// reservaRoutes.get('/', ReservaController.getAllReservas)
reservaRoutes.get('/usuario/:usuarioId', ReservaController.getReservaByIdUsuario)
reservaRoutes.get('/vuelo/:vueloId', ReservaController.getReservaByIdVuelo)
reservaRoutes.put('/cancel/:id', ReservaController.cancelarReserva)
reservaRoutes.post('/procesar-pago/:reservaId', ReservaController.procesarPagoCompra)
