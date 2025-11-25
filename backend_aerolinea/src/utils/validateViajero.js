import { flightService } from '../services/flightService.js'
import { reservaService } from '../services/reservaService.js'
import { viajeroService } from '../services/viajeroService.js'
import { tiqueteService } from '../services/tiqueteService.js'

export class validateViajero {
  static async validate (viajero, vueloId) {
    const vuelo = await flightService.getFlightById(vueloId)
    if (!vuelo) {
      throw new Error('Vuelo no encontrado')
    }

    const reservas = await reservaService.getReservaByIdVuelo(vueloId)

    for (const reserva of reservas) {
      if (reserva.estado_reserva !== 'CANCELADA') {
        const viajeros = await viajeroService.getViajerosByReservaId(reserva.id_reserva)
        for (const v of viajeros) {
          if (v.nombre === viajero.nombre && v.apellido === viajero.apellido && v.dni_viajero === viajero.dni_viajero) {
            throw new Error('El viajero ya está asociado a una reserva en este vuelo')
          }
        }
      }
    }

    const tiquetes = await tiqueteService.getTiquetesByVueloId(vueloId)

    for (const tiquete of tiquetes) {
      const v = tiquete.viajero
      if (v.nombre === viajero.nombre && v.apellido === viajero.apellido && v.dni_viajero === viajero.dni_viajero) {
        throw new Error('El viajero ya está asociado a un tiquete en este vuelo')
      }
    }

    return true
  }
}
