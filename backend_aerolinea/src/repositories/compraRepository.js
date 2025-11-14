import Compra from '../models/compra.js'

export class CompraRepository {
  static async getAll () {
    return await Compra.findAll()
  }

  static async findById ({ id_compra }) {
    return await Compra.findByPk(id_compra)
  }

  static async create ({ compra }) {
    return await Compra.create(compra)
  }

  static async update ({ id_compra, compraData }) {
    const compra = await Compra.findByPk(id_compra)
    if (!compra) return null
    
    await compra.update(compraData)
    return await Compra.findByPk(id_compra)
  }

  static async delete ({ id_compra }) {
    const compra = await Compra.findByPk(id_compra)
    if (!compra) return null
    
    await compra.destroy()
    return compra
  }
}
