import { userLoginService } from '../services/userLoginService.js'
import {sendPin} from '../utils/mailer.js'
import { validateUser, validatePartialUser } from '../schema/userSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import pkg from 'jsonwebtoken'
const { jwt } = pkg


export class loginController {
static async login (req, res) {
    try {
      console.log('🟡 req.body recibido:', req.body)
      const { identifier, contrasena } = req.body

      const user = await userLoginService.login({ identifier, contrasena })

      const token = jwt.sign(
        { 
            id: user.id_usuario, 
            descripcion_usuario: user.descripcion_usuario, 
            email: user.correo_electronico, 
            role: user.id_rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h', algorithm: 'RS256'}
      )

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Se debe cambiar a none si se usan diferentes dominios para el front y back, se puede usar para subdominios
        maxAge: 1000 * 60 * 60 // 1 hora
      })

      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: user })
    } catch (err) {
      console.error(err)
      res.status(401).json({ error: err.message || 'Error en inicio de sesión' })
    }
  }

  static async logout (req, res) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    res.json({ mensaje: 'Cierre de sesión exitoso' })
  }

  static async requestPasswordReset (req, res) {
    try {
      const { identifier } = req.body
      await userLoginService.requestPasswordReset({ identifier })
      res.json({ mensaje: 'PIN enviado si el correo electronico existe' })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: err.message })
    }
  }

  static async resetPassword (req, res) {
    try {
      const { identifier, pin, nueva_contrasena } = req.body
      const user = await userLoginService.resetPassword({ identifier, pin, nueva_contrasena })
      res.json({ mensaje: 'Contraseña actualizada', usuario: user })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: err.message })
    }
}
}