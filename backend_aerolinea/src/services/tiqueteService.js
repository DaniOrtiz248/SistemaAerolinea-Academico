import { TiqueteRepository } from '../repositories/tiqueteRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class TiqueteService {
  static errors = []

  static async listTiquetes () {
    try {
      return await TiqueteRepository.getAll()
    } catch (error) {
      console.error('Error listing tiquetes:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener la lista de tiquetes')
    }
  }

  static async getTiqueteById ({ id_tiquete }) {
    try {
      const tiquete = await TiqueteRepository.findById({ id_tiquete })
      if (!tiquete) {
        throw new AppError(404, 'TIQUETE_NOT_FOUND', 'Tiquete no encontrado')
      }
      return tiquete
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error('Error getting tiquete by ID:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener el tiquete')
    }
  }

  static async getTiquetesByCompra ({ id_compra }) {
    try {
      return await TiqueteRepository.findByCompra({ id_compra })
    } catch (error) {
      console.error('Error getting tiquetes by compra:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener los tiquetes de la compra')
    }
  }

  static async create ({ tiquete }) {
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }

    try {
      return await TiqueteRepository.create({ tiquete })
    } catch (error) {
      console.error('Error creating tiquete:', error)
      throw error
    }
  }

  static async update ({ id_tiquete, tiqueteData }) {
    try {
      const tiquete = await TiqueteRepository.findById({ id_tiquete })
      
      if (!tiquete) {
        const errors = [
          new AppError(
            404,
            'TIQUETE_NOT_FOUND',
            'El tiquete que intentas actualizar no existe',
            'id_tiquete'
          )
        ]
        throw new ValidationError(errors)
      }

      const updatedTiquete = await TiqueteRepository.update({ id_tiquete, tiqueteData })
      return updatedTiquete
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error updating tiquete:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al actualizar el tiquete')
    }
  }

  static async delete ({ id_tiquete }) {
    try {
      const tiquete = await TiqueteRepository.findById({ id_tiquete })
      
      if (!tiquete) {
        const errors = [
          new AppError(
            404,
            'TIQUETE_NOT_FOUND',
            'El tiquete que intentas eliminar no existe',
            'id_tiquete'
          )
        ]
        throw new ValidationError(errors)
      }

      await TiqueteRepository.delete({ id_tiquete })
      
      return {
        message: 'Tiquete eliminado exitosamente',
        deletedTiquete: {
          id_tiquete: tiquete.id_tiquete,
          codigo_tiquete: tiquete.codigo_tiquete
        }
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error deleting tiquete:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al eliminar el tiquete')
    }
  }
}
