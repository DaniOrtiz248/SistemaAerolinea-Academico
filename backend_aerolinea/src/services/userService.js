import { UserRepository } from '../repositories/userRepository.js'
import { UserPerfilRepository } from '../repositories/userPerfilRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class UserService {
  static errors = []

  static async listUsers () {
    return await UserRepository.getAll()
  }

  static async validarCrearUsuario (usuario) {
    // Verificar si el nombre de usuario ya existe
    const existUsername = await UserRepository.findByUsername(usuario)
    if (existUsername) {
      this.errors.push(new AppError(409, 'USERNAME_EXISTS', 'El nombre de usuario ya está en uso', 'descripcion_usuario'))
    }

    // Verificar si el correo ya existe
    const existEmail = await UserRepository.findByEmail(usuario)
    if (existEmail) {
      this.errors.push(new AppError(409, 'USER_EXISTS', 'El correo electrónico ya está registrado', 'correo_electronico'))
    }

    return true
  }

  static async validarCrearUsuarioPerfil (usuarioPerfil) {
    // Verificar si el DNI ya existe
    const existDNI = await UserPerfilRepository.findByDNI(usuarioPerfil)
    if (existDNI) {
      this.errors.push(new AppError(409, 'DNI_EXISTS', 'El DNI ya está registrado', 'dni_usuario'))
    }
  }

  static async create ({ usuario, usuarioPerfil }) {
    // Validar datos antes de crear
    await this.validarCrearUsuario(usuario)
    await this.validarCrearUsuarioPerfil(usuarioPerfil)
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }
    // Crear usuario y perfil
    const usuarioReturn = await UserRepository.create({ usuario })
    usuarioPerfil.id_usuario = usuarioReturn.id_usuario
    const usuarioPerfilReturn = await UserPerfilRepository.create({ usuarioPerfil })
    return { usuario: usuarioReturn.toJSON(), usuarioPerfil: usuarioPerfilReturn.toJSON() }
  }

  static async createAdmin ({ usuario }) {
    // ------------------------------------------------------
    // Validar datos antes de crear
    await this.validarCrearUsuario(usuario)
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = []
      throw new ValidationError(errors)
    }
    // Crear usuario y perfil
    const usuarioReturn = await UserRepository.create({ usuario })

    return { usuario: usuarioReturn.toJSON() }
  }

  static async update ({ id, userData }) {
    return await UserRepository.update({ id, userData })
  }

  static async delete ({ id }) {
    return await UserRepository.delete({ id })
  }

  static async updateProfile ({ id_usuario, usuarioData, usuarioPerfilData }) {
    // Validar que el usuario existe
    const existingUser = await UserRepository.findByPk({ id: id_usuario })
    if (!existingUser) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Usuario no encontrado')
    }

    // Si hay datos de usuario básicos para actualizar
    let updatedUsuario = null
    if (usuarioData && Object.keys(usuarioData).length > 0) {
      updatedUsuario = await UserRepository.update({ 
        id: id_usuario, 
        userData: usuarioData 
      })
    }

    // Si hay datos de perfil para actualizar
    let updatedUsuarioPerfil = null
    if (usuarioPerfilData && Object.keys(usuarioPerfilData).length > 0) {
      updatedUsuarioPerfil = await UserPerfilRepository.update({ 
        id_usuario, 
        userPerfilData: usuarioPerfilData 
      })
    }

    return {
      usuario: updatedUsuario ? updatedUsuario.toJSON() : null,
      usuarioPerfil: updatedUsuarioPerfil ? updatedUsuarioPerfil.toJSON() : null
    }
  }

  static async getUserProfile ({ id_usuario }) {
    const usuario = await UserRepository.findByPk({ id: id_usuario })
    const usuarioPerfil = await UserPerfilRepository.findByUserId({ id_usuario })
    
    if (!usuario) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Usuario no encontrado')
    }

    return {
      usuario: usuario.toJSON(),
      usuarioPerfil: usuarioPerfil ? usuarioPerfil.toJSON() : null
    }
  }
}
