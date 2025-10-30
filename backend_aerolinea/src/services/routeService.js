import { RouteRepository } from '../repositories/routeRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class RouteService {
  static async getAll () {
    return await RouteRepository.getAll()
  }

  static async create (route) {
    // Validar que no exista una ruta con el mismo origen y destino (ida)
    const existingRouteIda = await RouteRepository.findByOriginAndDestination({
      ciudad_origen: route.ciudad_origen,
      ciudad_destino: route.ciudad_destino
    })

    if (existingRouteIda) {
      const errors = [
        new AppError(
          409, 
          'ROUTE_EXISTS', 
          `Ya existe una ruta de ida entre ${existingRouteIda.origen.nombre_ciudad} y ${existingRouteIda.destino.nombre_ciudad} (Código: ${existingRouteIda.codigo_ruta})`,
          'ciudad_origen'
        )
      ]
      throw new ValidationError(errors)
    }

    // Validar que no exista la ruta inversa (vuelta)
    const existingRouteVuelta = await RouteRepository.findByOriginAndDestination({
      ciudad_origen: route.ciudad_destino,
      ciudad_destino: route.ciudad_origen
    })

    if (existingRouteVuelta) {
      const errors = [
        new AppError(
          409, 
          'ROUTE_EXISTS', 
          `Ya existe una ruta de vuelta entre ${existingRouteVuelta.origen.nombre_ciudad} y ${existingRouteVuelta.destino.nombre_ciudad} (Código: ${existingRouteVuelta.codigo_ruta})`,
          'ciudad_destino'
        )
      ]
      throw new ValidationError(errors)
    }

    // Crear la ruta de ida (la que envió el usuario) con el código que ya viene
    console.log('Creando ruta de ida con código:', route.codigo_ruta)
    const rutaIda = await RouteRepository.create({ route })

    // Generar código para la ruta de vuelta DESPUÉS de crear la de ida
    const { generateRouteCode } = await import('../utils/generateRouteCode.js')
    const codigoVuelta = await generateRouteCode(route.es_nacional)
    console.log('Código generado para vuelta:', codigoVuelta)
    
    const routeVuelta = {
      ciudad_origen: route.ciudad_destino,
      ciudad_destino: route.ciudad_origen,
      precio_primer_clase: route.precio_primer_clase,
      precio_segunda_clase: route.precio_segunda_clase,
      es_nacional: route.es_nacional,
      codigo_ruta: codigoVuelta
    }

    const rutaVuelta = await RouteRepository.create({ route: routeVuelta })

    return {
      message: 'Rutas de ida y vuelta creadas exitosamente',
      ruta_ida: rutaIda,
      ruta_vuelta: rutaVuelta
    }
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
