import SegmentoViaje from '../models/segmento_viaje.js'

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
}
