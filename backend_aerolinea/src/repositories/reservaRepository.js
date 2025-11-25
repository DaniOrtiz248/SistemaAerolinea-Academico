import Reserva from '../models/reserva.js'
import Viajero from '../models/viajero.js'

export class ReservaRepository {
  static async createReserva (reservaData) {
    const reserva = await Reserva.create(reservaData)
    return reserva
  }

  static async getReservaById (id) {
    return await Reserva.findByPk(id, {
      include: Viajero
    }
    )
  }

  static async updateReserva (id, updateData) {
    const reserva = await Reserva.findByPk(id)
    if (!reserva) {
      throw new Error('Reserva no encontrada')
    }
    await reserva.update(updateData)
    return reserva
  }

  static async deleteReserva (id) {
    const reserva = await Reserva.findByPk(id)
    if (!reserva) {
      throw new Error('Reserva no encontrada')
    }
    await reserva.destroy()
  }

  static async getReservaByIdUsuario (usuarioId) {
    return await Reserva.findAll({ where: { usuario_id: usuarioId } })
  }

  static async getReservaByIdVuelo (vueloId) {
    return await Reserva.findAll({ where: { vuelo_id: vueloId } })
  }
}
