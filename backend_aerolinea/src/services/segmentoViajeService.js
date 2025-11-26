import { SegmentoViajeRepository } from '../repositories/segmentoViajeRepository.js'

export class SegmentoViajeService {
  
  static async create (segmentoData) {
    try {
      return await SegmentoViajeRepository.create(segmentoData)
    } catch (error) {
      throw new Error('Error creating segmento viaje: ' + error.message)
    }
  }

  static async getById (id_segmento) {
    try {
      return await SegmentoViajeRepository.findById(id_segmento)
    } catch (error) {
      throw new Error('Error getting segmento viaje by ID: ' + error.message)
    }
  }

  static async getAllByViajeroId (viajero_id) {
    try {
      return await SegmentoViajeRepository.findAllByViajeroId(viajero_id)
    } catch (error) {
      throw new Error('Error getting segmentos viaje by viajero ID: ' + error.message)
    }
  }

  static async delete (id_segmento) {
    try {
      const deleted = await SegmentoViajeRepository.delete(id_segmento)
      if (!deleted) {
        throw new Error('Segmento de viaje no encontrado')
      }
      return deleted
    } catch (error) {
      throw new Error('Error deleting segmento viaje: ' + error.message)
    }
  }

  static async deleteSegmentosReserva (reservaID) {
    try {
      return await SegmentoViajeRepository.deleteByReservaId(reservaID)
    } catch (error) {
      throw new Error('Error deleting segmentos viaje by reserva ID: ' + error.message)
    }
  }

  static async update (id_segmento, updateData) {
    try {
      const updatedSegmento = await SegmentoViajeRepository.update(id_segmento, updateData)
      if (!updatedSegmento) {
        throw new Error('Segmento de viaje no encontrado')
      }
      return updatedSegmento
    } catch (error) {
      throw new Error('Error updating segmento viaje: ' + error.message)
    }
  }

  static async findAllByReservaId (reservaId) {
    try {
      return await SegmentoViajeRepository.findAllByReservaId(reservaId)
    } catch (error) {
      throw new Error('Error getting segmentos viaje by reserva ID: ' + error.message)
    }
  }
}
