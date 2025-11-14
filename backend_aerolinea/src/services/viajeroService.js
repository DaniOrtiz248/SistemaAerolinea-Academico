import { ViajeroRepository } from '../repositories/viajeroRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class ViajeroService {
  static errors = []

  static async listViajeros () {
    try {
      return await ViajeroRepository.getAll()
    } catch (error) {
      console.error('Error listing viajeros:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener la lista de viajeros')
    }
  }

  static async getViajeroById ({ id_viajero }) {
    try {
      const viajero = await ViajeroRepository.findById({ id_viajero })
      if (!viajero) {
        throw new AppError(404, 'VIAJERO_NOT_FOUND', 'Viajero no encontrado')
      }
      return viajero
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error('Error getting viajero by ID:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener el viajero')
    }
  }

  static async getViajerosByUsuario ({ usuario_asociado }) {
    try {
      return await ViajeroRepository.findByUsuario({ usuario_asociado })
    } catch (error) {
      console.error('Error getting viajeros by usuario:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener los viajeros del usuario')
    }
  }

  static async create ({ viajero }) {
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }

    try {
      return await ViajeroRepository.create({ viajero })
    } catch (error) {
      console.error('Error creating viajero:', error)
      throw error
    }
  }

  static async update ({ id_viajero, viajeroData }) {
    try {
      const viajero = await ViajeroRepository.findById({ id_viajero })
      
      if (!viajero) {
        const errors = [
          new AppError(
            404,
            'VIAJERO_NOT_FOUND',
            'El viajero que intentas actualizar no existe',
            'id_viajero'
          )
        ]
        throw new ValidationError(errors)
      }

      const updatedViajero = await ViajeroRepository.update({ id_viajero, viajeroData })
      return updatedViajero
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error updating viajero:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al actualizar el viajero')
    }
  }

  static async delete ({ id_viajero }) {
    try {
      const viajero = await ViajeroRepository.findById({ id_viajero })
      
      if (!viajero) {
        const errors = [
          new AppError(
            404,
            'VIAJERO_NOT_FOUND',
            'El viajero que intentas eliminar no existe',
            'id_viajero'
          )
        ]
        throw new ValidationError(errors)
      }

      await ViajeroRepository.delete({ id_viajero })
      
      return {
        message: 'Viajero eliminado exitosamente',
        deletedViajero: {
          id_viajero: viajero.id_viajero,
          dni_viajero: viajero.dni_viajero,
          nombre: `${viajero.primer_nombre} ${viajero.primer_apellido}`
        }
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error deleting viajero:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al eliminar el viajero')
    }
  }
}
