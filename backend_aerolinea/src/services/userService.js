import { UserRepository } from '../repositories/userRepository.js'
import { UserPerfilRepository } from '../repositories/userPerfilRepository.js'

export class UserService {
  static async listUsers () {
    return await UserRepository.getAll()
  }

  static async create ({ usuario, usuarioPerfil }) {
    // Verificar si el correo ya existe --------------------- Aun por Reseolver las validaciones
    const existUser = await UserRepository.findByEmail({ correo: usuario.correo_electronico })
    if (existUser) {
      const error = new Error({
        message: 'El correo electrónico ya está en uso',
        errors: [{ message: 'correo_electronico must be unique', path: ['correo_electronico'], value: usuario.correo_electronico }]
      })
      error.name = 'SequelizeUniqueConstraintError'
      throw error
    }
    const usuarioReturn = await UserRepository.create({ usuario })
    usuarioPerfil.id_usuario = usuarioReturn.id_usuario
    const usuarioPerfilReturn = await UserPerfilRepository.create({ usuarioPerfil })
    return { usuario: usuarioReturn.toJSON(), usuarioPerfil: usuarioPerfilReturn.toJSON() }
  }

  static async update ({ id, userData }) {
    return await UserRepository.update({ id, userData })
  }

  static async delete ({ id }) {
    return await UserRepository.delete({ id })
  }

  static async login ({ email, password }) {
    const user = await UserRepository.findByEmail({ email })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Comparación de contraseña (sin hash por ahora)
    if (user.contrasena !== password) {
      throw new Error('Contraseña incorrecta')
    }

    // Si todo bien, retornamos info del usuario (sin contraseña)
    const { contrasena, ...userData } = user.toJSON()
    return userData
  }
}
