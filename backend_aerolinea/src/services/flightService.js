import { FlightRepository } from '../repositories/flightRepository.js'
import { RouteRepository } from '../repositories/routeRepository.js'
import { UserPerfilRepository } from '../repositories/userPerfilRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'
import { sendNewsPromotion } from '../utils/mailer.js'
import { AsientoService } from './asientoService.js'

export class FlightService {
  static errors = []

  static async listFlights () {
    try {
      return await FlightRepository.getAll()
    } catch (error) {
      console.error('Error listing flights:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener la lista de vuelos')
    }
  }

  static async getFlightById ({ ccv }) {
    try {
      console.log('Fetching flight with CCV:', ccv)
      const flight = await FlightRepository.findById({ ccv })
      if (!flight) {
        throw new AppError(404, 'FLIGHT_NOT_FOUND', 'Vuelo no encontrado')
      }
      return flight
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      console.error('Error getting flight by ID:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al obtener el vuelo')
    }
  }

  static async searchFlights ({ ciudad_origen, ciudad_destino, fecha_vuelo }) {
    try {
      return await FlightRepository.findByOriginDestination({ 
        ciudad_origen, 
        ciudad_destino, 
        fecha_vuelo 
      })
    } catch (error) {
      console.error('Error searching flights:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al buscar vuelos')
    }
  }

  static async create ({ vuelo }) {
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }

    try {
      // Obtener información de la ruta para determinar el tipo de vuelo
      const ruta = await RouteRepository.findById({ id: vuelo.ruta_relacionada })
      
      if (!ruta) {
        throw new AppError(404, 'ROUTE_NOT_FOUND', 'La ruta asociada no existe')
      }

      // Asignar cantidad de asientos según el tipo de vuelo
      const cantidadAsientos = ruta.es_nacional ? 150 : 250

      // Agregar cantidad de asientos al objeto vuelo
      const vueloConAsientos = {
        ...vuelo,
        asientos: cantidadAsientos
      }

      const newVuelo = await FlightRepository.create({ vuelo: vueloConAsientos })
      await AsientoService.bulkCreate(newVuelo.ccv, ruta.es_nacional)
      return newVuelo
    } catch (error) {
      console.log('Error programando el vuelo:', error)
      throw error
    }
  }

  static async publishNewsPromotion ({ ccv }) {
    try {
      const vuelo = await FlightRepository.findById({ ccv })
      if (!vuelo) {
        throw new AppError(404, 'FLIGHT_NOT_FOUND', 'Vuelo no encontrado para publicar noticias de promoción')
      }

      const emailSent = await UserPerfilRepository.findByEnNoticias()

      // Enviar emails en paralelo con manejo de errores
      // Para evitar saturar el servidor de email
      for (const userPerfil of emailSent) {
        const usuario = await userPerfil.getUsuario()
        const emailResult = await sendNewsPromotion(usuario.correo_electronico, vuelo)
        console.log(`Email sent to ${usuario.correo_electronico}: ${emailResult}`)
      }
    } catch (error) {
      console.error('Error publishing news promotion:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al publicar noticias de promoción')
    }
  }

  static async delete ({ ccv }) {
    try {
      const flight = await FlightRepository.findById({ ccv })
      
      if (!flight) {
        const errors = [
          new AppError(
            404,
            'FLIGHT_NOT_FOUND',
            'El vuelo que intentas eliminar no existe',
            'ccv'
          )
        ]
        throw new ValidationError(errors)
      }

      await FlightRepository.delete({ ccv })
      
      return {
        message: 'Vuelo eliminado exitosamente',
        deletedFlight: {
          ccv: flight.ccv,
          ruta: flight.ruta?.codigo_ruta,
          fecha: flight.fecha_vuelo,
          origen: flight.ruta?.origen?.nombre_ciudad,
          destino: flight.ruta?.destino?.nombre_ciudad
        }
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error deleting flight:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al eliminar el vuelo')
    }
  }

  static async update ({ ccv, flightData }) {
    try {
      const flight = await FlightRepository.findById({ ccv })
      
      if (!flight) {
        const errors = [
          new AppError(
            404,
            'FLIGHT_NOT_FOUND',
            'El vuelo que intentas actualizar no existe',
            'ccv'
          )
        ]
        throw new ValidationError(errors)
      }

      const updatedFlight = await FlightRepository.update({ ccv, flightData })
      return updatedFlight
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error
      }
      console.error('Error updating flight:', error)
      throw new AppError(500, 'INTERNAL_ERROR', 'Error al actualizar el vuelo')
    }
  }
}
