import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS
const MAIL_FROM = process.env.MAIL_FROM || MAIL_USER

if (!MAIL_USER || !MAIL_PASS) {
  console.warn('⚠️ mailer: MAIL_USER o MAIL_PASS no definidos en .env')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS // App Password si Gmail tiene 2FA
  }
})

// Verifica la conexión al iniciar (opcional, no bloqueante)
transporter.verify().then(() => {
  console.log('✅ Mailer listo')
}).catch((err) => {
  console.warn('⚠️ Mailer verify falló:', err.message || err)
})

// Devuelve true si se envió correctamente, false si falló (no lanza)
export async function sendPin (toEmail, pin) {
  const mailOptions = {
    from: MAIL_FROM,
    to: toEmail,
    subject: 'PIN de restablecimiento - Aero Penguin',
    text: `Tu código PIN es: ${pin}. 
    
    Tiene validez de 15 minutos. Si no solicitaste este PIN, ignora este correo.`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Correo enviado:', info.messageId)
    return true
  } catch (err) {
    console.error('❌ Error al enviar correo:', err && err.message ? err.message : err)
    // No propagar el error para no revelar información al cliente; devolver false
    return false
  }
}
