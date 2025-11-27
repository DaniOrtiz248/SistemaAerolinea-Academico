import { Router } from 'express'
import { SegmentoViajeController } from '../controllers/segmentoViajeController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// Rutas protegidas - requieren autenticación
router.post('/', authMiddleware, SegmentoViajeController.create)
router.get('/:id', authMiddleware, SegmentoViajeController.getById)
router.get('/viajero/:viajeroId', authMiddleware, SegmentoViajeController.getAllByViajeroId)
router.get('/reserva/:reservaId', authMiddleware, SegmentoViajeController.getAllByReservaId)
router.put('/:id', authMiddleware, SegmentoViajeController.update)
router.delete('/:id', authMiddleware, SegmentoViajeController.delete)
// Endpoint para cambiar de asiento
router.patch('/:id/cambiar-asiento', authMiddleware, SegmentoViajeController.cambiarAsiento)

// Endpoint para verificar si puede cambiar de asiento
router.get('/:id/verificar-cambio', authMiddleware, SegmentoViajeController.verificarCambioAsiento)

export default router
