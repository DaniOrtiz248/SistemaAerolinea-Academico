import { CompraRepository } from '../repositories/compraRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class CompraService {
  static errors = []

  static async listCompras () {
    try {
      return await CompraRepository.getAll()
    } catch (error) {
      console.error('Error listing compras:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener la lista de compras')
    }
  }

  static async getCompraById ({ id_compra }) {
    try {
      const compra = await CompraRepository.findById({ id_compra })
      if (!compra) {
        throw new AppError(404, 'COMPRA_NOT_FOUND', 'Compra no encontrada')
      }
      return compra
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error('Error getting compra by ID:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener la compra')
    }
  }

  static async create ({ compra }) {
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }

    try {
      return await CompraRepository.create({ compra })
    } catch (error) {
      console.error('Error creating compra:', error)
      throw error
    }
  }

  static async update ({ id_compra, compraData }) {
    try {
      const compra = await CompraRepository.findById({ id_compra })
      
      if (!compra) {
        const errors = [
          new AppError(
            404,
            'COMPRA_NOT_FOUND',
            'La compra que intentas actualizar no existe',
            'id_compra'
          )
        ]
        throw new ValidationError(errors)
      }

      const updatedCompra = await CompraRepository.update({ id_compra, compraData })
      return updatedCompra
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error updating compra:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al actualizar la compra')
    }
  }

  static async delete ({ id_compra }) {
    try {
      const compra = await CompraRepository.findById({ id_compra })
      
      if (!compra) {
        const errors = [
          new AppError(
            404,
            'COMPRA_NOT_FOUND',
            'La compra que intentas eliminar no existe',
            'id_compra'
          )
        ]
        throw new ValidationError(errors)
      }

      await CompraRepository.delete({ id_compra })
      
      return {
        message: 'Compra eliminada exitosamente',
        deletedCompra: {
          id_compra: compra.id_compra,
          fecha_compra: compra.fecha_compra,
          valor_total: compra.valor_total
        }
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error deleting compra:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al eliminar la compra')
    }
  }
}
