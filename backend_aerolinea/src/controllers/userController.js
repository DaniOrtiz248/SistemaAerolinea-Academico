import { UserService } from '../services/userService.js'
import { validateUser, validatePartialUser } from '../schema/userSchema.js'
import { email } from 'zod'

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

  static async create (req, res) {
    const validation = validateUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }

    try {
      const created = await UserService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json(err.errors)
      }

      res.status(500).json({ error: 'Error al crear usuario' })
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

  static async login (req, res) {
    try {
      console.log('🟡 req.body recibido:', req.body)
      const { correo_electronico, contrasena } = req.body

      const user = await UserService.login({ correo_electronico, contrasena })

      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: user })
      
    } catch (err) {
      console.error(err)
      res.status(401).json({ error: err.message || 'Error en inicio de sesión' })
    }
  }
}
