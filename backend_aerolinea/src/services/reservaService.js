import { reservaRepository } from '../repositories/reservaRepository.js'

export class reservaService {
  static async createReserva (reservaData) {
    try {
      return await reservaRepository.createReserva(reservaData)
    } catch (error) {
      console.error('Error creando reserva:', error)
      throw error
    }
  }

  static async getReservaById (id) {
    try {
      return await reservaRepository.getReservaById(id)
    } catch (error) {
      console.error('Error obteniendo reserva por ID:', error)
      throw error
    }
  }

  static async updateReserva (id, updateData) {
    try {
      return await reservaRepository.updateReserva(id, updateData)
    } catch (error) {
      console.error('Error actualizando reserva:', error)
      throw error
    }
  }

  static async deleteReserva (id) {
    try {
      return await reservaRepository.deleteReserva(id)
    } catch (error) {
      console.error('Error eliminando reserva:', error)
      throw error
    }
  }

  static async getReservaByIdUsuario (usuarioId) {
    try {
      return await reservaRepository.getReservaByIdUsuario(usuarioId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de usuario:', error)
      throw error
    }
  }

  static async getReservaByIdVuelo (vueloId) {
    try {
      return await reservaRepository.getReservaByIdVuelo(vueloId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de vuelo:', error)
      throw error
    }
  }
}
