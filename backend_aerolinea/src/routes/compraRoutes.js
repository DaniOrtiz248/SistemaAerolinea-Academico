import { Router } from 'express'
import { CompraController } from '../controllers/compraController.js'

export const compraRouter = Router()

compraRouter.get('/', CompraController.listCompras)
compraRouter.get('/:id_compra', CompraController.getCompraById)
compraRouter.post('/', CompraController.createCompra)
compraRouter.put('/:id_compra', CompraController.updateCompra)
compraRouter.delete('/:id_compra', CompraController.deleteCompra)
