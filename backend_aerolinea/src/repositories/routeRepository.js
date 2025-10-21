import Ruta from '../models/ruta.js'
import Ciudad from '../models/ciudad.js'

export class RouteRepository {
  static async create ({ route }) {
    return await Ruta.create(route)
  }

  static async getAll () {
    return await Ruta.findAll({
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
      ],
      order: [['created_at', 'DESC']]
    })
  }

  static async findByOriginAndDestination ({ ciudad_origen, ciudad_destino }) {
    return await Ruta.findOne({
      where: {
        ciudad_origen,
        ciudad_destino
      },
      include: [
        {
          model: Ciudad,
          as: 'origen',
          attributes: ['nombre_ciudad']
        },
        {
          model: Ciudad,
          as: 'destino',
          attributes: ['nombre_ciudad']
        }
      ]
    })
  }
}
