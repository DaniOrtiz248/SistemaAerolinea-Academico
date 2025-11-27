import SegmentoViaje from '../models/segmento_viaje.js'
import Reserva from '../models/reserva.js'
import Asiento from '../models/asiento.js'
import Compra from '../models/compra.js'
import Viajero from '../models/viajero.js'
import Vuelo from '../models/vuelo.js'
import Ruta from '../models/ruta.js'
import Ciudad from '../models/ciudad.js'

export class SegmentoViajeRepository {
  static async create (segmentoData) {
    const segmento = await SegmentoViaje.create(segmentoData)
    return segmento
  }

  static async findById (id_segmento) {
    return await SegmentoViaje.findByPk(id_segmento)
  }

  static async findAllByViajeroId (viajero_id) {
    return await SegmentoViaje.findAll({ where: { viajero_id } })
  }

  static async delete (id_segmento) {
    const segmento = await this.findById(id_segmento)
    if (segmento) {
      await segmento.destroy()
      return true
    }
    return false
  }

  static async update (id_segmento, updateData) {
    const segmento = await this.findById(id_segmento)
    if (segmento) {
      await segmento.update(updateData)
      return segmento
    }
    return null
  }

  static async deleteByReservaId (reservaId) {
    return await SegmentoViaje.destroy({ where: { reserva_id: reservaId } })
  }

  static async findAllByReservaId (reservaId) {
    return await SegmentoViaje.findAll({ 
      where: { reserva_id: reservaId },
      include: [
        { 
          model: Viajero,
          attributes: ['id_viajero', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'correo_electronico']
        },
        { 
          model: Asiento,
          attributes: ['id_asiento', 'asiento', 'fila', 'columna', 'estado', 'clase']
        },
        {
          model: Vuelo,
          as: 'vuelo',
          include: [
            {
              model: Ruta,
              as: 'ruta',
              include: [
                { model: Ciudad, as: 'origen' },
                { model: Ciudad, as: 'destino' }
              ]
            }
          ]
        }
      ]
    })
  }

  /**
   * Cambia el asiento de un segmento de viaje
   * Verifica que la reserva/compra esté pagada antes de permitir el cambio
   * @param {number} id_segmento - ID del segmento de viaje
   * @param {number} nuevo_asiento_id - ID del nuevo asiento
   * @returns {Object} Segmento actualizado con información del asiento
   */
  static async cambiarAsiento (id_segmento, nuevo_asiento_id) {
    // 1. Buscar el segmento con sus relaciones
    const segmento = await SegmentoViaje.findByPk(id_segmento, {
      include: [
        { model: Asiento },
        { model: Reserva }
      ]
    })

    if (!segmento) {
      throw new Error('Segmento de viaje no encontrado')
    }

    // 2. Verificar que la reserva esté PAGADA
    if (segmento.reserva.estado_reserva !== 'PAGADA') {
      throw new Error('No se puede cambiar el asiento. La reserva debe estar pagada.')
    }

    // 3. Verificar que existe una compra asociada a la reserva
    const compra = await Compra.findOne({
      where: { reserva_id: segmento.reserva_id }
    })

    /**if (!compra) {
      throw new Error('No se puede cambiar el asiento. No se encontró registro de compra.')
    }
    */
    // 4. Buscar el nuevo asiento y verificar disponibilidad
    const nuevoAsiento = await Asiento.findByPk(nuevo_asiento_id)

    if (!nuevoAsiento) {
      throw new Error('El asiento seleccionado no existe')
    }

    if (nuevoAsiento.estado !== 'DISPONIBLE') {
      throw new Error('El asiento seleccionado no está disponible')
    }

    if (nuevoAsiento.vuelo_id !== segmento.vuelo_id) {
      throw new Error('El asiento no pertenece al vuelo del segmento')
    }

    if (nuevoAsiento.clase !== segmento.reserva.clase_reserva) {
      throw new Error(`El asiento debe ser de clase ${segmento.reserva.clase_reserva}`)
    }

    // 5. Liberar el asiento anterior
    const asientoAnterior = await Asiento.findByPk(segmento.asiento_id)
    if (asientoAnterior) {
      await asientoAnterior.update({ estado: 'DISPONIBLE' })
    }

    // 6. Ocupar el nuevo asiento
    await nuevoAsiento.update({ estado: 'OCUPADO' })

    // 7. Actualizar el segmento con el nuevo asiento
    await segmento.update({ asiento_id: nuevo_asiento_id })

    // 8. Retornar el segmento actualizado con toda la información
    return await SegmentoViaje.findByPk(id_segmento, {
      include: [
        { model: Asiento },
        { model: Reserva }
      ]
    })
  }

  /**
   * Verifica si un segmento puede cambiar de asiento
   * @param {number} id_segmento - ID del segmento de viaje
   * @returns {Object} { permitido: boolean, razon: string }
   */
  static async puedeCambiarAsiento (id_segmento) {
    const segmento = await SegmentoViaje.findByPk(id_segmento, {
      include: [{ model: Reserva }]
    })

    if (!segmento) {
      return { permitido: false, razon: 'Segmento no encontrado' }
    }

    if (segmento.reserva.estado_reserva !== 'PAGADA') {
      return { permitido: false, razon: 'La reserva debe estar pagada' }
    }

    /**const compra = await Compra.findOne({
      where: { reserva_id: segmento.reserva_id }
    })
    */
    /**if (!compra) {
      //return { permitido: false, razon: 'No se encontró registro de compra' }
    }
    */
    return { permitido: true, razon: 'Cambio de asiento permitido' }
  }
}
