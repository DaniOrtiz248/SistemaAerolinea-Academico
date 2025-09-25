import { UserService } from '../services/userService.js'
import { validateUser, validatePartialUser } from '../schema/userSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import pkg from 'jsonwebtoken'
const { jwt } = pkg

export class UserController {
  static async getAll (req, res) {
    try {
      const users = await UserService.listUsers()
      res.json(users)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener usuarios' })
    }
  }

  // Metodo para crear/registrar un usuario Cliente
  static async create (req, res) {
    // TODO: Crear la seccion de inicio de sesion cuando se registra el usuairo
    const validation = validateUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }

    try {
      req.body.usuario.id_rol = 3 // Forzar rol de cliente
      const created = await UserService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      if (err instanceof ValidationError) {
        const formatted = formatErrors(err)
        return res.status(formatted.status).json(formatted.error)
      }

      res.status(500).json({ error: 'Error al crear usuario' })
    }
  }

  // Metodo para crear un usuario Admin
  static async createAdmin (req, res) {
    const validation = validatePartialUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }

    try {
      req.body.usuario.id_rol = 2 // Forzar rol de admin
      const created = await UserService.createAdmin(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.log(err)
      if (err instanceof ValidationError) {
        const formatted = formatErrors(err)
        return res.status(formatted.status).json(formatted.error)
      }

      res.status(500).json({ error: 'Error al crear usuario Administrador' })
    }
  }

  static async update (req, res) {
    const validation = validatePartialUser(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error })
    }

    try {
      const id = req.params.id
      const updated = await UserService.update({ id, userData: req.body })
      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al actualizar usuario' })
    }
  }

  static async delete (req, res) {
    try {
      const id = req.params.id
      await UserService.delete({ id })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al eliminar usuario' })
    }
  }

  static async updateProfile (req, res) {
    try {
      const { id_usuario } = req.params
      const { usuarioData, usuarioPerfilData } = req.body

      const allowedUsuarioFields = ['imagen_usuario']
      const allowedPerfilFields = [
        'primer_nombre', 
        'segundo_nombre', 
        'primer_apellido', 
        'segundo_apellido',
        'fecha_nacimiento',
        'pais_nacimiento',
        'estado_nacimiento', 
        'ciudad_nacimiento',
        'direccion_facturacion',
        'id_genero_usuario'
      ]

      const filteredUsuarioData = {}
      const filteredPerfilData = {}

      if (usuarioData) {
        Object.keys(usuarioData).forEach(key => {
          if (allowedUsuarioFields.includes(key)) {
            filteredUsuarioData[key] = usuarioData[key]
          }
        })
      }

      if (usuarioPerfilData) {
        Object.keys(usuarioPerfilData).forEach(key => {
          if (allowedPerfilFields.includes(key)) {
            filteredPerfilData[key] = usuarioPerfilData[key]
          }
        })
      }

      const result = await UserService.updateProfile({
        id_usuario: parseInt(id_usuario),
        usuarioData: Object.keys(filteredUsuarioData).length > 0 ? filteredUsuarioData : null,
        usuarioPerfilData: Object.keys(filteredPerfilData).length > 0 ? filteredPerfilData : null
      })

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado correctamente',
        data: result
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      })
    }
  }

  static async getUserProfile (req, res) {
    try {
      const { id_usuario } = req.params
      
      const result = await UserService.getUserProfile({
        id_usuario: parseInt(id_usuario)
      })

      res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      })
    }
  }
}
