import { CompraService } from '../services/compraService.js'
import { validateCompra, validatePartialCompra } from '../schema/compraSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'

export class CompraController {
  static async listCompras (req, res) {
    try {
      const compras = await CompraService.listCompras()
      
      res.status(200).json({
        success: true,
        data: compras,
        message: 'Compras obtenidas exitosamente'
      })
    } catch (error) {
      console.error('Error in listCompras:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener las compras',
        details: error.message
      })
    }
  }

  static async getCompraById (req, res) {
    try {
      const { id_compra } = req.params
      const compra = await CompraService.getCompraById({ id_compra: parseInt(id_compra) })
      
      res.status(200).json({
        success: true,
        data: compra,
        message: 'Compra obtenida exitosamente'
      })
    } catch (error) {
      console.error('Error in getCompraById:', error)
      if (error.code === 'COMPRA_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al obtener la compra',
        details: error.message
      })
    }
  }

  static async createCompra (req, res) {
    const validation = validateCompra(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de compra inválidos',
        details: validation.error.issues
      })
    }

    try {
      const compra = await CompraService.create({ compra: req.body })
      res.status(201).json({
        success: true,
        data: compra,
        message: 'Compra creada exitosamente'
      })
    } catch (error) {
      console.error('Error in createCompra:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al crear la compra',
        details: error.message
      })
    }
  }

  static async updateCompra (req, res) {
    const validation = validatePartialCompra(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de compra inválidos',
        details: validation.error.issues
      })
    }

    try {
      const { id_compra } = req.params
      const updatedCompra = await CompraService.update({ 
        id_compra: parseInt(id_compra), 
        compraData: req.body 
      })
      
      res.status(200).json({
        success: true,
        data: updatedCompra,
        message: 'Compra actualizada exitosamente'
      })
    } catch (error) {
      console.error('Error in updateCompra:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al actualizar la compra',
        details: error.message
      })
    }
  }

  static async deleteCompra (req, res) {
    try {
      const { id_compra } = req.params
      const result = await CompraService.delete({ id_compra: parseInt(id_compra) })
      res.status(200).json(result)
    } catch (error) {
      console.error('Error in deleteCompra:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al eliminar la compra',
        details: error.message
      })
    }
  }
}
