import { ReservaService } from '../services/reservaService.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import { validateReserva, validatePartialReserva } from '../schema/reservaSchema.js'
import { sendReservationConfirmation } from '../utils/mailer.js'

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
      const reservas = await ReservaService.getReservaByIdVuelo(req.params.idVuelo)
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
}
