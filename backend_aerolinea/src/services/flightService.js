import { FlightRepository } from '../repositories/flightRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

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
      return await FlightRepository.create({ vuelo })
    } catch (error) {
      console.log('Error programando el vuelo:', error)
      throw error
    }
  }
}