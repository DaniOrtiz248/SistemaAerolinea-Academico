import { userLoginService } from '../services/userLoginService.js'
import {sendPin} from '../utils/mailer.js'
import { validateUser, validatePartialUser } from '../schema/userSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

// Usar process.cwd() para obtener el directorio de trabajo actual
const cwd = process.cwd();

// Construir la ruta completa al archivo
const privateKeyPath = path.join(cwd, 'privateKey.pem'); // Esto debería funcionar correctamente

// Leer el archivo
const privateKey = fs.readFileSync(privateKeyPath);

export class loginController {
static async login (req, res) {
    try {
      console.log('🟡 req.body recibido:', req.body)
      const { identifier, contrasena } = req.body

      const user = await userLoginService.login({ identifier, contrasena })
      console.log('key:', privateKey)

      const token = jwt.sign(
        { 
            id: user.id_usuario, 
            descripcion_usuario: user.descripcion_usuario, 
            email: user.correo_electronico, 
            role: user.id_rol 
        },
        privateKey,
        { expiresIn: '1h', algorithm: 'RS256'}
      )

      res.cookie('access_token', token, {
        httpOnly: true, // La cookie no puede ser leída desde JavaScript
        secure: false, // Establecido como 'false' para desarrollo (debería ser 'true' en producción)
        sameSite: 'Lax', // Cambia esto a 'None' si el frontend y backend están en dominios diferentes
        maxAge: 1000 * 60 * 60, // La cookie expirará en 1 hora
        path: '/' // La cookie estará disponible en todo el sitio
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
      SameSite: 'Lax'
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