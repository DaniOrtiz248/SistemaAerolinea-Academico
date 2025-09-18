import Usuario from '../models/usuario.js'

export class UserRepository {
  static async getAll () {
    return await Usuario.findAll()
  }

  static async create ({ usuario }) {
    return await Usuario.create(usuario)
  }

  static async update ({ id, userData }) {
    const [updated] = await Usuario.update(userData, {
      where: { id_usuario: id }
    })
    if (updated === 0) {
      throw new Error('Usuario no encontrado o sin cambios')
    }
    return await Usuario.findByPk(id)
  }

  static async delete ({ id }) {
    const deleted = await Usuario.destroy({
      where: { id_usuario: id }
    })
    if (deleted === 0) {
      throw new Error('Usuario no encontrado')
    }
    return 0
  }

  // eslint-disable-next-line camelcase
  static async findByEmail ({ correo_electronico }) {
    // eslint-disable-next-line camelcase
    return await Usuario.findOne({ where: { correo_electronico } })
  }

  // eslint-disable-next-line camelcase
  static async findByUsername ({ descripcion_usuario }) {
    // eslint-disable-next-line camelcase
    return await Usuario.findOne({ where: { descripcion_usuario } })
  }
}
