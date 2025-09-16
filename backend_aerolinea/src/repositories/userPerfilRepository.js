import UsuarioPerfil from '../models/usuarioPerfil.js'

export class UserPerfilRepository {
  static async getAll () {
    return await UsuarioPerfil.findAll()
  }

  static async create ({ usuarioPerfil }) {
    return await UsuarioPerfil.create(usuarioPerfil)
  }

  static async update ({ id, userData }) {
    const [updated] = await UsuarioPerfil.update(userData, {
      where: { id_usuario: id }
    })
    if (updated === 0) {
      throw new Error('Usuario no encontrado o sin cambios')
    }
    return await UsuarioPerfil.findByPk(id)
  }

  static async delete ({ id }) {
    const deleted = await UsuarioPerfil.destroy({
      where: { id_usuario: id }
    })
    if (deleted === 0) {
      throw new Error('Usuario no encontrado')
    }
    return 0
  }

  static async findByEmail (correo) {
    return await UsuarioPerfil.findOne({ where: { correo_electronico: correo } })
  }
}
