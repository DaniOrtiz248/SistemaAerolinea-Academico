import Asiento from '../models/asiento.js'

export class AsientoRepository {
  static async create (asientoData) {
    try {
      const asiento = await Asiento.create(asientoData)
      return asiento
    } catch (error) {
      console.error('Error creating asiento:', error)
      throw error
    }
  }

  static async bulkCreate (asientoDataArray) {
    try {
      const asientos = await Asiento.bulkCreate(asientoDataArray)
      return asientos
    } catch (error) {
      console.error('Error bulk creating asientos:', error)
      throw error
    }
  }

  static async findById (id_asiento) {
    try {
      const asiento = await Asiento.findByPk(id_asiento)
      return asiento
    } catch (error) {
      console.error('Error finding asiento by ID:', error)
      throw error
    }
  }

  static async update (id_asiento, updateData) {
    try {
      const [updatedRowsCount] = await Asiento.update(updateData, {
        where: { id_asiento }
      })
      return updatedRowsCount
    } catch (error) {
      console.error('Error updating asiento:', error)
      throw error
    }
  }

  static async delete (id_asiento) {
    try {
      const deletedRowsCount = await Asiento.destroy({
        where: { id_asiento }
      })
      return deletedRowsCount
    } catch (error) {
      console.error('Error deleting asiento:', error)
      throw error
    }
  }

  static async findAllByVueloId (vuelo_id) {
    try {
      const asientos = await Asiento.findAll({
        where: { vuelo_id }
      })
      return asientos
    } catch (error) {
      console.error('Error finding asientos by vuelo ID:', error)
      throw error
    }
  }
}
