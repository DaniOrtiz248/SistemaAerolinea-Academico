import { RouteRepository } from '../repositories/routeRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class RouteService {
  static async getAll () {
    return await RouteRepository.getAll()
  }

  static async create (route) {
    // Validar que no exista una ruta con el mismo origen y destino
    const existingRoute = await RouteRepository.findByOriginAndDestination({
      ciudad_origen: route.ciudad_origen,
      ciudad_destino: route.ciudad_destino
    })

    if (existingRoute) {
      const errors = [
        new AppError(
          409, 
          'ROUTE_EXISTS', 
          `Ya existe una ruta entre ${existingRoute.origen.nombre_ciudad} y ${existingRoute.destino.nombre_ciudad} (Código: ${existingRoute.codigo_ruta})`,
          'ciudad_origen'
        )
      ]
      throw new ValidationError(errors)
    }

    return await RouteRepository.create({ route })
  }

  static async update (id, routeData) {
    return await RouteRepository.update(id, routeData)
  }

  static async delete (id) {
    const route = await RouteRepository.findById(id)
    
    if (!route) {
      const errors = [
        new AppError(
          404,
          'ROUTE_NOT_FOUND',
          'La ruta que intentas eliminar no existe',
          'id_ruta'
        )
      ]
      throw new ValidationError(errors)
    }

    await RouteRepository.delete(id)
    return { 
      message: 'Ruta eliminada exitosamente',
      deletedRoute: {
        codigo_ruta: route.codigo_ruta,
        origen: route.origen.nombre_ciudad,
        destino: route.destino.nombre_ciudad
      }
    }
  }
}
