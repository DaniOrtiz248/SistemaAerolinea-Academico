import { FlightService } from '../services/flightService.js'
import { ReservaService } from '../services/reservaService.js'
import { ViajeroService } from '../services/viajeroService.js'
import { TiqueteService } from '../services/tiqueteService.js'

export class validateViajero {
  static async validate (viajero, vueloId, es_Ida) {
    vueloId = parseInt(vueloId)
    console.log('Validating viajero:', viajero, 'for vueloId:', vueloId)
    const vuelo = await FlightService.getFlightById({ ccv: vueloId })
    if (!vuelo) {
      throw new Error('Vuelo no encontrado')
    }

    const reservas = es_Ida ? await ReservaService.getReservaByIdVueloIda(vueloId) : await ReservaService.getReservaByIdVueloVuelta(vueloId)

    for (const reserva of reservas) {
      if (reserva.estado_reserva !== 'CANCELADA') {
        const viajeros = await ViajeroService.getViajerosByReservaId(reserva.id_reserva)
        for (const v of viajeros) {
          if (v.nombre === viajero.nombre && v.apellido === viajero.apellido && v.dni_viajero === viajero.dni_viajero) {
            throw new Error('El viajero ya está asociado a una reserva en este vuelo')
          }
        }
      }
    }

    const tiquetes = await TiqueteService.getTiquetesByVueloId(vueloId)

    for (const tiquete of tiquetes) {
      const v = tiquete.viajero
      if (v.nombre === viajero.nombre && v.apellido === viajero.apellido && v.dni_viajero === viajero.dni_viajero) {
        throw new Error('El viajero ya está asociado a un tiquete en este vuelo')
      }
    }

    return true
  }
}
