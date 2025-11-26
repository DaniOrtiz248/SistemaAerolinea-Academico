import { AsientoService } from '../services/asientoService.js'

export class AsientoController {
  static async getAll (req, res) {
    try {
      const asientos = await AsientoService.getAsientosByVueloId(req.params.vueloId)
      return res.json(asientos)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener asientos' })
    }
  }

  static async update (req, res) {
    try {
      const updated = await AsientoService.update(req.params.id, req.body)
      if (!updated) {
        return res.status(404).json({ error: 'Asiento no encontrado' })
      }
      res.json(updated)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al actualizar asiento' })
    }
  }
}
