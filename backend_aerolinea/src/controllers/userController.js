import { UserService } from '../services/userService.js'

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
    try {
      const created = await UserService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al crear usuario' })
    }
  }

  static async update (req, res) {
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

      if (!correo_electronico || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' })
      }

      const user = await UserService.login({ email: correo_electronico, password: contrasena })
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: user })
      console.log(`✅ Login exitoso para el usuario: ${user.descripcion_usuario}`)
    } catch (err) {
      console.error(err)
      res.status(401).json({ error: err.message || 'Error en inicio de sesión' })
    }
  }
}
