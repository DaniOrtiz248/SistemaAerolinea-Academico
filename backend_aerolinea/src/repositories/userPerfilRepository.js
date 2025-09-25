import UsuarioPerfil from '../models/usuarioPerfil.js'

export class UserPerfilRepository {
  static async getAll () {
    return await UsuarioPerfil.findAll()
  }

  static async create ({ usuarioPerfil }) {
    return await UsuarioPerfil.create(usuarioPerfil)
  }

  static async update ({ id_usuario, userPerfilData }) {
    const [updated] = await UsuarioPerfil.update(userPerfilData, {
      where: { id_usuario }
    })
    if (updated === 0) {
      throw new Error('Perfil de usuario no encontrado o sin cambios')
    }
    return await UsuarioPerfil.findOne({ where: { id_usuario } })
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

  static async findByUserId ({ id_usuario }) {
    return await UsuarioPerfil.findOne({ where: { id_usuario } })
  }
}
