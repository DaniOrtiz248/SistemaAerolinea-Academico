import Vuelo from '../models/vuelo.js'

export class FlightRepository {
  static async getAll () {
    return await Vuelo.findAll({
      order: [['fecha_vuelo', 'ASC'], ['hora_salida_vuelo', 'ASC']]
    })
  }

  static async findById ({ ccv }) {
    return await Vuelo.findByPk(ccv)
  }

  static async findByOriginDestination ({ ciudad_origen, ciudad_destino, fecha_vuelo }) {
    const whereClause = {
      ciudad_origen,
      ciudad_destino
    }

    if (fecha_vuelo) {
      whereClause.fecha_vuelo = fecha_vuelo
    }

    return await Vuelo.findAll({
      where: whereClause,
      order: [['fecha_vuelo', 'ASC'], ['hora_salida_vuelo', 'ASC']]
    })
  }

  static async create ({ vuelo }) {
    return await Vuelo.create(vuelo)
  }

  static async update ({ ccv, flightData }) {
    const [updated] = await Vuelo.update(flightData, {
      where: { ccv }
    })
    if (updated === 0) {
      throw new Error('Vuelo no encontrado o sin cambios')
    }
    return await Vuelo.findByPk(ccv)
  }

  static async delete ({ ccv }) {
    const deleted = await Vuelo.destroy({
      where: { ccv }
    })
    if (deleted === 0) {
      throw new Error('Vuelo no encontrado')
    }
    return deleted
  }
}