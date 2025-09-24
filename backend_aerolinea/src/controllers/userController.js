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

  
}
