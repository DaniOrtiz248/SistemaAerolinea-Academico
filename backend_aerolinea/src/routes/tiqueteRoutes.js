import { Router } from 'express'
import { TiqueteController } from '../controllers/tiqueteController.js'

export const tiqueteRouter = Router()

tiqueteRouter.get('/', TiqueteController.listTiquetes)
tiqueteRouter.get('/:id_tiquete', TiqueteController.getTiqueteById)
tiqueteRouter.get('/compra/:id_compra', TiqueteController.getTiquetesByCompra)
tiqueteRouter.post('/', TiqueteController.createTiquete)
tiqueteRouter.put('/:id_tiquete', TiqueteController.updateTiquete)
tiqueteRouter.delete('/:id_tiquete', TiqueteController.deleteTiquete)
