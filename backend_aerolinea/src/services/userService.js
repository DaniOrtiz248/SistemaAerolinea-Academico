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
      this.errors.push(new AppError(409, 'EMAIL_EXISTS', 'El correo electrónico ya está registrado', 'correo_electronico'))
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

  static async validarActualizarUsuarioPerfil (usuarioPerfil, id_usuario) {
    // Verificar si el DNI ya existe en otro perfil (excluyendo el actual)
    const existDNI = await UserPerfilRepository.findByDNI(usuarioPerfil)
    if (existDNI && existDNI.id_usuario !== parseInt(id_usuario)) {
      this.errors.push(new AppError(409, 'DNI_EXISTS', 'El DNI ya está registrado por otro usuario', 'dni_usuario'))
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
    // Validar datos antes de crear
    await this.validarCrearUsuario(usuario)
    
    // Verificar si hay errores de validación ANTES de intentar crear
    if (this.errors.length > 0) {
      const errors = this.errors
      this.errors = [] // Limpiar errores
      throw new ValidationError(errors)
    }
    
    try {
      // Crear usuario
      const usuarioReturn = await UserRepository.create({ usuario })
      return { usuario: usuarioReturn.toJSON() }
    } catch (error) {
      // Manejar errores de base de datos u otros errores técnicos
      console.error('Error creating admin user:', error)
      throw error
    }
  }

  static async createAdminProfile ({ id_usuario, usuarioPerfilData }) {
    try {
      // Verificar que el usuario existe y es administrador
      const usuario = await UserRepository.findByPk({ id: id_usuario })
      if (!usuario) {
        throw new AppError(404, 'USER_NOT_FOUND', 'Usuario no encontrado')
      }
      
      if (usuario.id_rol !== 2) {
        throw new AppError(403, 'NOT_ADMIN', 'Solo los administradores pueden crear perfiles')
      }
      
      // Crear el perfil
      const usuarioPerfilReturn = await UserPerfilRepository.create({ 
        usuarioPerfil: usuarioPerfilData 
      })
      
      return usuarioPerfilReturn.toJSON()
    } catch (error) {
      console.error('Error creating admin profile:', error)
      throw error
    }
  }

  static async update ({ id, userData }) {
    return await UserRepository.update({ id, userData })
  }

  static async delete ({ id }) {
    return await UserRepository.delete({ id })
  }

  static async getUserProfile ({ id_usuario }) {
    try {
      const usuario = await UserRepository.findByPk({ id: id_usuario })
      if (!usuario) {
        throw new AppError(404, 'USER_NOT_FOUND', 'Usuario no encontrado')
      }
      
      const usuarioPerfil = await UserPerfilRepository.findByUserId({ id_usuario })
      
      return {
        usuario: usuario.toJSON(),
        usuarioPerfil: usuarioPerfil ? usuarioPerfil.toJSON() : null
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  static async updateProfile ({ id_usuario, usuarioData, usuarioPerfilData }) {
    // Validar datos del perfil antes de actualizar
    if (usuarioPerfilData) {
      await this.validarActualizarUsuarioPerfil(usuarioPerfilData, id_usuario)
      if (this.errors.length > 0) {
        const errors = this.errors
        this.errors = []
        throw new ValidationError(errors)
      }
    }

    try {
      // Actualizar datos del usuario si se proporcionan
      if (usuarioData) {
        await UserRepository.update({ id: id_usuario, userData: usuarioData })
      }
      
      // Actualizar datos del perfil
      if (usuarioPerfilData) {
        await UserPerfilRepository.update({ id_usuario, userPerfilData: usuarioPerfilData })
      }
      
      // Retornar los datos actualizados
      return await this.getUserProfile({ id_usuario })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}
