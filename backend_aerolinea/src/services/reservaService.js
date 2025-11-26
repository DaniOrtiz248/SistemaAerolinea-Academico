import { ReservaRepository } from '../repositories/reservaRepository.js'
import { generarCodigoReserva, calcularExpiracionReserva } from '../utils/reservaUtils.js'

export class ReservaService {
  static async create (reservaData) {
    try {
      const codigoReserva = await generarCodigoReserva()
      const fechaExpiracion = calcularExpiracionReserva()

      reservaData.fecha_expiracion = fechaExpiracion
      reservaData.codigo_reserva = codigoReserva

      return await ReservaRepository.create(reservaData)
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

  static async delete (id) {
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

  static async getReservaByIdVueloIda (vueloId) {
    try {
      return await ReservaRepository.getReservaByIdVueloIda(vueloId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de vuelo:', error)
      throw error
    }
  }

  static async getReservaByIdVueloVuelta (vueloId) {
    try {
      return await ReservaRepository.getReservaByIdVueloVuelta(vueloId)
    } catch (error) {
      console.error('Error obteniendo reserva por ID de vuelo:', error)
      throw error
    }
  }
}
