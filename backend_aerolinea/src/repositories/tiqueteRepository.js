import Tiquete from '../models/tiquete.js'
import Compra from '../models/compra.js'
import Vuelo from '../models/vuelo.js'
import Viajero from '../models/viajero.js'
import Ruta from '../models/ruta.js'
import Ciudad from '../models/ciudad.js'

export class TiqueteRepository {
  static async getAll () {
    return await Tiquete.findAll({
      include: [
        { model: Compra },
        {
          model: Vuelo,
          include: [{
            model: Ruta,
            as: 'ruta',
            include: [
              { model: Ciudad, as: 'origen' },
              { model: Ciudad, as: 'destino' }
            ]
          }]
        },
        { model: Viajero }
      ]
    })
  }

  static async findById ({ id_tiquete }) {
    return await Tiquete.findByPk(id_tiquete, {
      include: [
        { model: Compra },
        {
          model: Vuelo,
          include: [{
            model: Ruta,
            as: 'ruta',
            include: [
              { model: Ciudad, as: 'origen' },
              { model: Ciudad, as: 'destino' }
            ]
          }]
        },
        { model: Viajero }
      ]
    })
  }

  static async findByCompra ({ id_compra }) {
    return await Tiquete.findAll({
      where: { id_compra },
      include: [
        { model: Compra },
        {
          model: Vuelo,
          include: [{
            model: Ruta,
            as: 'ruta',
            include: [
              { model: Ciudad, as: 'origen' },
              { model: Ciudad, as: 'destino' }
            ]
          }]
        },
        { model: Viajero }
      ]
    })
  }

  static async create ({ tiquete }) {
    return await Tiquete.create(tiquete)
  }

  static async update ({ id_tiquete, tiqueteData }) {
    const tiquete = await Tiquete.findByPk(id_tiquete)
    if (!tiquete) return null

    await tiquete.update(tiqueteData)
    return await this.findById({ id_tiquete })
  }

  static async delete ({ id_tiquete }) {
    const tiquete = await this.findById({ id_tiquete })
    if (!tiquete) return null

    await Tiquete.destroy({ where: { id_tiquete } })
    return tiquete
  }

  static async getTiquetesByVueloId (vueloId) {
    return await Tiquete.findAll({
      where: { id_vuelo: vueloId },
      include: Viajero
    })
  }
}
