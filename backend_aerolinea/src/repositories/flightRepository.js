import Vuelo from '../models/vuelo.js'
import Ruta from '../models/ruta.js'
import Ciudad from '../models/ciudad.js'

export class FlightRepository {
  static async getAll () {
    return await Vuelo.findAll({
      include: [
        {
          model: Ruta,
          as: 'ruta',
          include: [
            {
              model: Ciudad,
              as: 'origen',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            },
            {
              model: Ciudad,
              as: 'destino',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            }
          ]
        }
      ],
      order: [['fecha_vuelo', 'ASC'], ['hora_salida_vuelo', 'ASC']]
    })
  }

  static async findById ({ ccv }) {
    return await Vuelo.findByPk(ccv, {
      include: [
        {
          model: Ruta,
          as: 'ruta',
          include: [
            {
              model: Ciudad,
              as: 'origen',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            },
            {
              model: Ciudad,
              as: 'destino',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            }
          ]
        }
      ]
    })
  }

  static async findByOriginDestination ({ ciudad_origen, ciudad_destino, fecha_vuelo }) {
    const whereClause = {}

    if (fecha_vuelo) {
      whereClause.fecha_vuelo = fecha_vuelo
    }

    return await Vuelo.findAll({
      where: whereClause,
      include: [
        {
          model: Ruta,
          as: 'ruta',
          where: {
            ciudad_origen,
            ciudad_destino
          },
          include: [
            {
              model: Ciudad,
              as: 'origen',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            },
            {
              model: Ciudad,
              as: 'destino',
              attributes: ['id_ciudad', 'nombre_ciudad', 'es_nacional']
            }
          ]
        }
      ],
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