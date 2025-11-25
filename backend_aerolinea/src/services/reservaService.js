import { ReservaRepository } from '../repositories/reservaRepository.js'

export class ReservaService {
  static async createReserva (reservaData) {
    try {
      return await ReservaRepository.createReserva(reservaData)
    } catch (error) {
      console.error('Error creando reserva:', error)
      throw error
    }
  }

  static async getReservaById (id) {
    try {
      return await ReservaRepository.getReservaById(id)
    } catch (error) {
      console.error('Error obteniendo reserva por ID:', error)
      throw error
    }
  }

  static async updateReserva (id, updateData) {
    try {
      return await ReservaRepository.updateReserva(id, updateData)
    } catch (error) {
      console.error('Error actualizando reserva:', error)
      throw error
    }
  }

  static async deleteReserva (id) {
    try {
      return await ReservaRepository.deleteReserva(id)
    } catch (error) {
      console.error('Error eliminando reserva:', error)
      throw error
    }
  }

  static async getReservaByIdUsuario (usuarioId) {
    try {
      return await ReservaRepository.getReservaByIdUsuario(usuarioId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de usuario:', error)
      throw error
    }
  }

  static async getReservaByIdVuelo (vueloId) {
    try {
      return await ReservaRepository.getReservaByIdVuelo(vueloId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de vuelo:', error)
      throw error
    }
  }
}
