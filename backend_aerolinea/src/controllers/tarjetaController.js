import { TarjetaService } from '../services/tarjetaService.js'
import { validateTarjeta, validatePartialTarjeta } from '../schema/tarjetaSchema.js'

export class TarjetaController {
  static async create (req, res) {
    const validation = validateTarjeta(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      const created = await TarjetaService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al crear tarjeta' })
    }
  }

  static async getById (req, res) {
    try {
      const tarjeta = await TarjetaService.getById(req.params.id)
      if (!tarjeta) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' })
      }
      res.json(tarjeta)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener tarjeta' })
    }
  }

  static async update (req, res) {
    const validation = validatePartialTarjeta(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      const updated = await TarjetaService.update(req.params.id, req.body)
      if (!updated) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' })
      }
      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al actualizar tarjeta' })
    }
  }

  static async delete (req, res) {
    try {
      const result = await TarjetaService.delete(req.params.id)
      if (!result) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' })
      }
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al eliminar tarjeta' })
    }
  }

  static async getByUsuarioId (req, res) {
    try {
      const tarjetas = await TarjetaService.getByUsuarioId(req.params.usuarioId)
      res.json(tarjetas)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener tarjetas por ID de usuario' })
    }
  }
}
