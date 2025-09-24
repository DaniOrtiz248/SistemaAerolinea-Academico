/* eslint-disable camelcase */
import { UserRepository } from '../repositories/userRepository.js'
import { UserPerfilRepository } from '../repositories/userPerfilRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'
import { sendPin } from '../utils/mailer.js'

// Envío de email y generación de token (nodemailer opcional)
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const PasswordResetStore = new Map() // key: correo_electronico, value: { pin, expiresAt }

function generatePin (length = 6) {
  const max = 10 ** length - 1
  const pin = (Math.floor(Math.random() * (max + 1))).toString().padStart(length, '0')
  return pin
}

/*async function sendPinByEmail (to, pin) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'PIN de restablecimiento de contraseña - Aero Penguin',
      text: `Tu PIN es: ${pin}. Tiene validez de 15 minutos.`
    })
  } else {
    // En entorno de desarrollo registramos el PIN en logs
    console.log(`[DEV] PIN para ${to}: ${pin}`)
  }
}*/

export class userLoginService {
  static errors = []

  static async listUsers () {
    return await UserRepository.getAll()
  }

  static async login ({ identifier, contrasena }) {
    if (!identifier || !contrasena) {
      throw new Error('Correo/Usuario y contraseña son obligatorios')
    }

    if (typeof identifier !== 'string' || typeof contrasena !== 'string') {
      throw new Error('Correo/Usuario y contraseña deben ser texto')
    }

    const isEmail = identifier.includes('@')
    let user

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(identifier)) {
        throw new Error('Formato de correo inválido')
      }
      user = await UserRepository.findByEmail({ correo_electronico: identifier })
    } else {
      user = await UserRepository.findByUsername({ descripcion_usuario: identifier })
    }

    if (!user) {
      throw new Error('Correo/Usuario no encontrado')
    }

    if (user.contrasena !== contrasena) {
      throw new Error('Contraseña incorrecta')
    }

    const { contrasena: _omit, ...userData } = user.toJSON ? user.toJSON() : user
    return userData
  }

  static async requestPasswordReset ({ identifier }) {
    if (!identifier) throw new Error('Identificador requerido')
    if (typeof identifier !== 'string') throw new Error('Identificador inválido')

    const isEmail = identifier.includes('@')
    let user
    if (isEmail) user = await UserRepository.findByEmail({ correo_electronico: identifier })
    else user = await UserRepository.findByUsername({ descripcion_usuario: identifier })

    if (!user) throw new Error('Usuario no encontrado')

    const correo = user.correo_electronico
    const pin = generatePin(6)
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutos

    PasswordResetStore.set(correo, { pin, expiresAt })
    await sendPin(correo, pin)

    return { ok: true }
  }

  static async resetPassword ({ identifier, pin, nueva_contrasena }) {
    if (!identifier || !pin || !nueva_contrasena) throw new Error('Datos incompletos')
    if (typeof identifier !== 'string' || typeof pin !== 'string' || typeof nueva_contrasena !== 'string') {
      throw new Error('Datos inválidos')
    }

    const isEmail = identifier.includes('@')
    let user
    if (isEmail) user = await UserRepository.findByEmail({ correo_electronico: identifier })
    else user = await UserRepository.findByUsername({ descripcion_usuario: identifier })

    if (!user) throw new Error('Usuario no encontrado')

    const correo = user.correo_electronico
    const record = PasswordResetStore.get(correo)
    if (!record) throw new Error('No hay solicitud de restablecimiento para este correo')
    if (record.pin !== pin) throw new Error('PIN inválido')
    if (Date.now() > record.expiresAt) {
      PasswordResetStore.delete(correo)
      throw new Error('PIN expirado')
    }

    // actualizar contraseña (en producción usar hash)
    const updatedUser = await UserRepository.updatePassword({ correo_electronico: correo, contrasena: nueva_contrasena })
    PasswordResetStore.delete(correo)
    return updatedUser.toJSON ? updatedUser.toJSON() : updatedUser
  }
}