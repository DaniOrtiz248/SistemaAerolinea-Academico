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

export async function sendNewsPromotion (toEmail, vuelo) {
  const ruta = await vuelo.getRuta()
  const ciudad_origen = await ruta.getOrigen()
  const ciudad_destino = await ruta.getDestino()

  const subject = `✈️ ¡Promoción especial en tu vuelo a ${ciudad_origen.nombre_ciudad}!`

  const content = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #0052cc; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">🌍 Aerolínea Internacional</h2>
        <p style="margin: 5px 0 0 0;">Ofertas exclusivas para nuestros viajeros</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        <h3 style="color: #0052cc;">¡Nueva promoción en vuelos programados!</h3>
        <p>Estimado/a viajero/a,</p>
        <p>
          Te informamos que se han programado nuevos vuelos con <strong>descuentos especiales</strong>.
          Aprovecha tarifas reducidas y vuela a tus destinos favoritos por menos.
        </p>

        <div style="background-color: #f0f4ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <p><strong>✈️ Ruta:</strong> ${ciudad_origen.nombre_ciudad} → ${ciudad_destino.nombre_ciudad}</p>
          <p><strong>📅 Fecha del vuelo:</strong> ${vuelo.fecha_vuelo}</p>
          <p><strong>🕒 Salida:</strong> ${new Date(vuelo.hora_salida_vuelo).toLocaleString()}</p>
          <p><strong>💸 Descuento:</strong> ${vuelo.porcentaje_promocion || 0}%</p>
        </div>

        <p style="margin-top: 20px;">
          Estas promociones son válidas por <strong>tiempo limitado</strong> y aplican solo para los cupos disponibles.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://www.aerolinea.com" 
             style="background-color: #0052cc; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
             Reservar ahora
          </a>
        </div>

        <p style="font-size: 0.9em; color: #777;">
          Si ya realizaste una reserva, puedes consultar tus vuelos o aplicar esta promoción desde tu perfil de usuario.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 0.85em; color: #777;">
        <p style="margin: 0;">Aerolínea Internacional © 2025</p>
        <p style="margin: 0;">Recibes este correo porque estás suscrito a nuestro sistema de noticias y promociones.</p>
      </div>
    </div>
  </div>
  `

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: toEmail,
    subject,
    html: content
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Correo enviado:', info.messageId)
    return true
  } catch (err) {
    console.error('❌ Error al enviar correo:', err?.message || err)
    return false
  }
}
