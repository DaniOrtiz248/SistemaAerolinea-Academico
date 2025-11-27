import { ReservaService } from '../services/reservaService.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import { validateReserva, validatePartialReserva } from '../schema/reservaSchema.js'
import { sendReservationConfirmation, sendPurchaseConfirmation } from '../utils/mailer.js'
import Usuario from '../models/usuario.js'
import Viajero from '../models/viajero.js'

export class ReservaController {
  static async getAll (req, res) {
    try {
      const reservas = await ReservaService.getAll()
      return res.json(reservas)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener reservas' })
    }
  }

  static async create (req, res) {
    const validation = validateReserva(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      const created = await ReservaService.create(req.body)
      
      // Enviar correo automáticamente al crear la reserva
      try {
        const usuario = await Usuario.findByPk(created.usuario_id)
        if (usuario && usuario.correo_electronico) {
          console.log(`📧 Enviando correo de confirmación a: ${usuario.correo_electronico}`)
          await sendReservationConfirmation(usuario.correo_electronico, created)
        }
      } catch (emailError) {
        console.error('⚠️ Error enviando correo (reserva creada exitosamente):', emailError.message)
        // No fallar la reserva por error de email
      }
      
      return res.status(201).json(created)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al crear reserva' })
    }
  }

  static async sendConfirmationEmail (req, res) {
    const { toEmail, reservaId } = req.body
    try {
      const reserva = await ReservaService.getReservaById(reservaId)
      await sendReservationConfirmation(toEmail, reserva)
      return res.json({ message: 'Correo de confirmación enviado' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al enviar correo de confirmación' })
    }
  }

  static async update (req, res) {
    const validation = validatePartialReserva(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      const updated = await ReservaService.update(req.params.id, req.body)
      if (!updated) {
        return res.status(404).json({ error: 'Reserva no encontrada' })
      }
      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al actualizar reserva' })
    }
  }

  static async delete (req, res) {
    try {
      const result = await ReservaService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al eliminar reserva' })
    }
  }

  static async getReservaById (req, res) {
    try {
      const reserva = await ReservaService.getReservaById(req.params.id)
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' })
      }
      res.json(reserva)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener reserva' })
    }
  }

  static async getReservaByIdUsuario (req, res) {
    try {
      const reservas = await ReservaService.getReservaByIdUsuario(req.params.usuarioId)
      if (!reservas || reservas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron reservas para el usuario' })
      }
      res.json(reservas)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener reservas del usuario' })
    }
  }

  static async getReservaByIdVuelo (req, res) {
    try {
      const reservas = await ReservaService.getReservaByIdVuelo(req.params.vueloId)
      if (!reservas || reservas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron reservas para el vuelo' })
      }
      res.json(reservas)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener reservas del vuelo' })
    }
  }

  static async cancelarReserva (req, res) {
    try {
      const updatedReserva = await ReservaService.cancelarReserva(req.params.id)
      res.json(updatedReserva)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al cancelar la reserva' })
    }
  }

  // Nuevo método para procesar el pago de una compra
  static async procesarPagoCompra (req, res) {
    try {
      const { reservaId } = req.params
      
      // Obtener la reserva
      const reserva = await ReservaService.getReservaById(reservaId)
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' })
      }

      // Verificar que esté ACTIVA
      if (reserva.estado_reserva !== 'ACTIVA') {
        return res.status(400).json({ 
          error: 'La reserva no está en estado ACTIVA',
          estado_actual: reserva.estado_reserva
        })
      }

      // Cambiar estado a PAGADA
      reserva.estado_reserva = 'PAGADA'
      await ReservaService.updateReserva(reservaId, reserva.dataValues)

      // Obtener usuario dueño de la reserva
      const usuario = await Usuario.findByPk(reserva.usuario_id)
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Obtener todos los viajeros de esta reserva
      const viajeros = await Viajero.findAll({ 
        where: { reserva_id: reservaId } 
      })

      // Enviar correos
      try {
        console.log(`💳 Procesando pago de reserva ${reserva.codigo_reserva}...`)
        await sendPurchaseConfirmation(usuario.correo_electronico, viajeros, reserva)
        console.log(`✅ Correos de compra enviados exitosamente`)
      } catch (emailError) {
        console.error('⚠️ Error enviando correos (pago procesado exitosamente):', emailError.message)
      }

      return res.json({
        success: true,
        message: 'Pago procesado exitosamente',
        reserva: reserva,
        correos_enviados: viajeros.length + 1 // viajeros + dueño
      })

    } catch (err) {
      console.error('Error procesando pago:', err)
      return res.status(500).json({ error: 'Error al procesar el pago' })
    }
  }
}
