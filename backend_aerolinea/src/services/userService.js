import { UserRepository } from '../repositories/userRepository.js'
import { UserPerfilRepository } from '../repositories/userPerfilRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'
import { tr } from 'zod/v4/locales'

export class UserService {
  static async listUsers () {
    return await UserRepository.getAll()
  }

  async validarUsuario (usuario) {
    let errors = []
    // Verificar si el correo ya existe --------------------- Aun por Reseolver las validaciones
    const existUser = await UserRepository.findByEmail({ correo: usuario.correo_electronico })
    if (existUser) {
      errors.push(new AppError(409, 'USER_EXISTS', 'El correo electrónico ya está registrado', 'correo_electronico'))
    }

    // Verificar si el nombre de usuario ya existe
    const existUsername = await UserRepository.findByUsername({ nombre_usuario: usuario.nombre_usuario })
    if (existUsername) {
      errors.push(new AppError(409, 'USERNAME_EXISTS', 'El nombre de usuario ya está en uso', 'nombre_usuario'))
    }

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
    return true
  }

  static async create ({ usuario, usuarioPerfil }) {
    
    // ------------------------------------------------------
    // Crear usuario y perfil
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
