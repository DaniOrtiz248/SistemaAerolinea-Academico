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

  static async update (id, routeData) {
    const route = await Ruta.findByPk(id)
    if (!route) throw new Error('Ruta no encontrada')
    return await route.update(routeData)
  }

  static async delete (id) {
    const route = await Ruta.findByPk(id)
    if (!route) {
      return null
    }
    await route.destroy()
    return route
  }

  static async findById (id) {
    return await Ruta.findByPk(id, {
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
    })
  }
}
