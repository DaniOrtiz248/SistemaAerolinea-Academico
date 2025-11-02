import { FlightService } from '../services/flightService.js'
import { validateFlight, validatePartialFlight } from '../schema/flightSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import { sendNewsPromotion } from '../utils/mailer.js'
import { calculateFlightTimes } from '../utils/timezoneHelper.js'

export class FlightController {
  static async listFlights (req, res) {
    try {
      const flights = await FlightService.listFlights()
      
      // Agregar información de zona horaria a cada vuelo
      const flightsWithTimezone = flights.map(flight => {
        try {
          const timezoneInfo = calculateFlightTimes(flight)
          return {
            ...flight.toJSON(),
            timezone_info: timezoneInfo
          }
        } catch (error) {
          console.error('Error calculating timezone for flight:', flight.ccv, error)
          // Si hay error, retornar el vuelo sin timezone_info
          return flight.toJSON()
        }
      })
      
      res.status(200).json({
        success: true,
        data: flightsWithTimezone,
        message: 'Vuelos obtenidos exitosamente'
      })
    } catch (error) {
      console.error('Error in listFlights:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener los vuelos',
        details: error.message
      })
    }
  }

  static async getFlightById (req, res) {
    try {
      const { ccv } = req.params
      const flight = await FlightService.getFlightById({ ccv: parseInt(ccv) })
      
      // Agregar información de zona horaria
      let flightWithTimezone
      try {
        const timezoneInfo = calculateFlightTimes(flight)
        flightWithTimezone = {
          ...flight.toJSON(),
          timezone_info: timezoneInfo
        }
      } catch (error) {
        console.error('Error calculating timezone for flight:', ccv, error)
        flightWithTimezone = flight.toJSON()
      }
      
      res.status(200).json({
        success: true,
        data: flightWithTimezone,
        message: 'Vuelo obtenido exitosamente'
      })
    } catch (error) {
      console.error('Error in getFlightById:', error)
      if (error.code === 'FLIGHT_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al obtener el vuelo',
        details: error.message
      })
    }
  }

  static async searchFlights (req, res) {
    try {
      const { ciudad_origen, ciudad_destino, fecha_vuelo } = req.query

      if (!ciudad_origen || !ciudad_destino) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren ciudad origen y ciudad destino para la búsqueda'
        })
      }

      const flights = await FlightService.searchFlights({
        ciudad_origen: parseInt(ciudad_origen),
        ciudad_destino: parseInt(ciudad_destino),
        fecha_vuelo
      })

      res.status(200).json({
        success: true,
        data: flights,
        message: 'Búsqueda de vuelos realizada exitosamente'
      })
    } catch (error) {
      console.error('Error in searchFlights:', error)
      res.status(500).json({
        success: false,
        error: 'Error al buscar vuelos',
        details: error.message
      })
    }
  }

  static async createFlight (req, res) {
    const validation = validateFlight(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de vuelo inválidos',
        details: validation.error.issues
      })
    }

    try {
      const flight = await FlightService.create({ vuelo: req.body })
      res.status(201).json({
        success: true,
        data: flight,
        message: 'Vuelo creado exitosamente'
      })
    } catch (error) {
      console.error('Error in createFlight:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al crear el vuelo',
        details: error.message
      })
    }
  }

  static async publishNewsPromotion (req, res) {
    // Implementar lógica para publicar noticias relacionadas con vuelos
    const ccv = req.params.ccv
    try {
      // const flight = await FlightService.getFlightById({ ccv: parseInt(ccv) })
      // const emailSent = await sendNewsPromotion('<user_email>', flight)
      FlightService.publishNewsPromotion({ ccv: parseInt(ccv) })
      res.status(200).json({ message: 'Promoción de noticias publicada exitosamente' })
    } catch (error) {
      console.error('Error in publishNewsPromotion:', error)
      res.status(500).json({
        error: 'Error al publicar la promoción de noticias',
        details: error.message
      })
    }
  }

  static async deleteFlight (req, res) {
    try {
      const { ccv } = req.params
      const result = await FlightService.delete({ ccv: parseInt(ccv) })
      res.status(200).json(result)
    } catch (error) {
      console.error('Error in deleteFlight:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al eliminar el vuelo',
        details: error.message
      })
    }
  }

  static async updateFlight (req, res) {
    const validation = validatePartialFlight(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de vuelo inválidos',
        details: validation.error.issues
      })
    }

    try {
      const { ccv } = req.params
      const updatedFlight = await FlightService.update({ 
        ccv: parseInt(ccv), 
        flightData: req.body 
      })
      
      res.status(200).json({
        success: true,
        data: updatedFlight,
        message: 'Vuelo actualizado exitosamente'
      })
    } catch (error) {
      console.error('Error in updateFlight:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al actualizar el vuelo',
        details: error.message
      })
    }
  }
}
