import Viajero from '../models/viajero.js'
import Usuario from '../models/usuario.js'
import Genero from '../models/genero.js'

export class ViajeroRepository {
  static async getAll () {
    return await Viajero.findAll({
      include: [
        { model: Genero },
        { model: Usuario }
      ]
    })
  }

  static async findById ({ id_viajero }) {
    return await Viajero.findByPk(id_viajero, {
      include: [
        { model: Genero },
        { model: Usuario }
      ]
    })
  }

  static async findByUsuario ({ usuario_asociado }) {
    return await Viajero.findAll({
      where: { usuario_asociado },
      include: [
        { model: Genero },
        { model: Usuario }
      ]
    })
  }

  static async create ({ viajero }) {
    return await Viajero.create(viajero)
  }

  static async update ({ id_viajero, viajeroData }) {
    const viajero = await Viajero.findByPk(id_viajero)
    if (!viajero) return null
    
    await viajero.update(viajeroData)
    return await this.findById({ id_viajero })
  }

  static async delete ({ id_viajero }) {
    const viajero = await this.findById({ id_viajero })
    if (!viajero) return null
    
    await Viajero.destroy({ where: { id_viajero } })
    return viajero
  }
}
