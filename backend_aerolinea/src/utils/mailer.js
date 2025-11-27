import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import SegmentoViaje from '../models/segmento_viaje.js'
import Viajero from '../models/viajero.js'
import Asiento from '../models/asiento.js'
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
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PIN de Restablecimiento</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔒 Restablecimiento de Contraseña</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.95;">Aero Penguin</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px; color: #333333;">
        <h2 style="color: #667eea; margin-top: 0; font-size: 22px;">Código de Verificación</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. 
          Utiliza el siguiente código PIN para continuar con el proceso:
        </p>

        <!-- PIN Code Box -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0; box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);">
          <p style="margin: 0 0 10px 0; color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Tu Código PIN</p>
          <div style="background-color: white; display: inline-block; padding: 15px 40px; border-radius: 8px; margin-top: 5px;">
            <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${pin}
            </span>
          </div>
        </div>

        <!-- Important Info -->
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 25px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⚠️ Importante:</strong> Este código tiene una validez de <strong>15 minutos</strong>.
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #555555; margin-top: 25px;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. 
          Tu cuenta permanecerá protegida.
        </p>

        <!-- Security Tips -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <p style="margin: 0 0 10px 0; color: #667eea; font-weight: bold; font-size: 15px;">
            🛡️ Consejos de Seguridad:
          </p>
          <ul style="margin: 10px 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
            <li>Nunca compartas este código con nadie</li>
            <li>Nuestro equipo nunca te pedirá tu PIN por teléfono o correo</li>
            <li>Si no reconoces esta solicitud, contacta a soporte inmediatamente</li>
          </ul>
        </div>
        
      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 13px;">
          <strong>Aero Penguin Airlines</strong> © 2025
        </p>
        <div style="margin-top: 15px;">
          <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Política de Privacidad</a>
          <span style="color: #dddddd;">|</span>
          <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Términos de Servicio</a>
        </div>
      </div>

    </div>

    <!-- Email Client Compatibility -->
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #999999; font-size: 11px;">
        Si tienes problemas para ver este correo, 
        <a href="#" style="color: #667eea;">ábrelo en tu navegador</a>
      </p>
    </div>
  </body>
  </html>
  `

  const mailOptions = {
    from: MAIL_FROM,
    to: toEmail,
    subject: '🔐 PIN de Restablecimiento - Aero Penguin',
    html: htmlContent,
    text: `Tu código PIN es: ${pin}. 
    
Tiene validez de 15 minutos. Si no solicitaste este PIN, ignora este correo.

Aero Penguin Airlines © 2025`
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

export async function sendReservationConfirmation(toEmail, reserva) {
  const {
    codigo_reserva,
    clase_reserva,
    cantidad_viajeros,
    precio_total,
    fecha_reserva,
    fecha_expiracion,
    estado_reserva,
    trayectoria
  } = reserva

  // Cargar vuelo IDA
  const vueloIda = await reserva.getVuelo_ida()
  const rutaIda = await vueloIda.getRuta()
  const origenIda = await rutaIda.getOrigen()
  const destinoIda = await rutaIda.getDestino()

  // Preparar posible vuelo de vuelta
  let vueloVuelta = null
  let rutaVuelta = null
  let origenVuelta = null
  let destinoVuelta = null

  if (trayectoria === 'IDAVUELTA' && reserva.vuelo_vuelta_id) {
    vueloVuelta = await reserva.getVuelo_vuelta()
    rutaVuelta = await vueloVuelta.getRuta()
    origenVuelta = await rutaVuelta.getOrigen()
    destinoVuelta = await rutaVuelta.getDestino()
  }

  // -----------------------------
  // BLOQUE DINÁMICO DE PRECIO
  // -----------------------------

  const bloquePrecio = estado_reserva === 'PAGADA'
    ? `
      <div style="background:#ecfdf5; padding:20px; border-left:4px solid #10b981; border-radius:8px; margin:25px 0;">
          <h3 style="margin-top:0; color:#059669;">Resumen de Pago</h3>
          <p style="font-size:22px; font-weight:bold; color:#059669; margin:5px 0;">
              Total pagado: $${precio_total}
          </p>
      </div>
    `
    : `
      <div style="background:#fff7ed; padding:20px; border-left:4px solid #f97316; border-radius:8px; margin:25px 0;">
          <h3 style="margin-top:0; color:#d97706;">Pendiente de Pago</h3>
          <p style="font-size:22px; font-weight:bold; color:#d97706; margin:5px 0;">
              Total a pagar: $${precio_total}
          </p>
          <p style="color:#b45309; font-size:14px; margin-top:8px;">
              Tu reserva está activa y pendiente de pago.  
              Una vez realices el pago, tu reserva cambiará a <strong>PAGADA</strong> y podrás realizar el check-in.
          </p>
          <p style="color:#b45309; font-size:14px; margin-top:8px;">
              <strong>⏰ Plazo de pago:</strong> Hasta ${new Date(fecha_expiracion).toLocaleString('es-ES', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
          </p>
      </div>
    `

  // -----------------------------
  // OBTENER INFORMACIÓN DE ASIENTOS
  // -----------------------------
  const segmentos = await SegmentoViaje.findAll({
    where: { reserva_id: reserva.id_reserva },
    include: [
      { model: Viajero },
      { model: Asiento }
    ]
  })

  // Construir HTML de asientos por trayecto
  const segmentosIda = segmentos.filter(seg => seg.trayecto === 'IDA')
  const segmentosVuelta = segmentos.filter(seg => seg.trayecto === 'VUELTA')

  const htmlAsientosIda = segmentosIda.length > 0 ? `
    <div style="margin-top:15px; padding:10px; background:#e0f2fe; border-radius:5px;">
      <p style="margin:5px 0; font-weight:bold; color:#0369a1;">Asientos asignados:</p>
      ${segmentosIda.map(seg => `
        <p style="margin:3px 0; font-size:14px;">
          • ${seg.viajero?.nombre || 'Viajero'} ${seg.viajero?.apellido || ''}: <strong>${seg.asiento?.asiento || 'Sin asignar'}</strong>
        </p>
      `).join('')}
    </div>
  ` : ''

  const htmlAsientosVuelta = segmentosVuelta.length > 0 ? `
    <div style="margin-top:15px; padding:10px; background:#dbeafe; border-radius:5px;">
      <p style="margin:5px 0; font-weight:bold; color:#1e40af;">Asientos asignados:</p>
      ${segmentosVuelta.map(seg => `
        <p style="margin:3px 0; font-size:14px;">
          • ${seg.viajero?.nombre || 'Viajero'} ${seg.viajero?.apellido || ''}: <strong>${seg.asiento?.asiento || 'Sin asignar'}</strong>
        </p>
      `).join('')}
    </div>
  ` : ''

  // -----------------------------
  // BLOQUE DEL VUELO IDA
  // -----------------------------

  const bloqueVueloIda = `
    <div style="background:#f8fafc; padding:20px; border-radius:10px; margin-top:20px;">
        <h3 style="margin-top:0; color:#0ea5e9;">✈️ Vuelo de IDA</h3>

        <p><strong>Ruta:</strong> ${origenIda.nombre_ciudad} → ${destinoIda.nombre_ciudad}</p>
        <p><strong>Fecha del vuelo:</strong> ${new Date(vueloIda.fecha_vuelo).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Hora de salida:</strong> ${new Date(vueloIda.hora_salida_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Clase:</strong> ${clase_reserva}</p>
        ${htmlAsientosIda}
    </div>
  `

  // -----------------------------
  // BLOQUE DEL VUELO VUELTA
  // -----------------------------

  const bloqueVueloVuelta = vueloVuelta ? `
    <div style="background:#f1f5f9; padding:20px; border-radius:10px; margin-top:20px;">
        <h3 style="margin-top:0; color:#0284c7;">🔁 Vuelo de VUELTA</h3>

        <p><strong>Ruta:</strong> ${origenVuelta.nombre_ciudad} → ${destinoVuelta.nombre_ciudad}</p>
        <p><strong>Fecha del vuelo:</strong> ${new Date(vueloVuelta.fecha_vuelo).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Hora de salida:</strong> ${new Date(vueloVuelta.hora_salida_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Clase:</strong> ${clase_reserva}</p>
        ${htmlAsientosVuelta}
    </div>
  ` : ''

  // -----------------------------
  // PLANTILLA HTML COMPLETA
  // -----------------------------

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Reserva</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f4f8;">

  <div style="max-width:700px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- HEADER -->
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color:white; padding:30px; text-align:center;">
          <h1 style="margin:0; font-size:28px;">✈️ Confirmación de Reserva</h1>
          <p style="margin-top:8px; opacity:0.9; font-size:16px;">Aero Penguin Airlines</p>
      </div>

      <!-- BODY -->
      <div style="padding:35px; color:#333;">

          <h2 style="color:#0ea5e9; margin-top:0;">¡Tu reserva ha sido generada!</h2>
          <p style="font-size:16px; line-height:1.6; color:#555;">
              Gracias por reservar con <strong>Aero Penguin</strong>.  
              A continuación encontrarás todos los detalles de tu viaje.
          </p>

          <!-- CÓDIGO -->
          <div style="background:linear-gradient(135deg, #3b82f6, #2563eb); padding:20px; border-radius:10px; text-align:center; margin:25px 0; color:white;">
              <p style="margin:0; font-size:14px;">Código de Reserva</p>
              <div style="background:white; padding:15px 40px; border-radius:8px; margin-top:10px; display:inline-block;">
                  <span style="font-size:30px; font-weight:bold; color:#2563eb; letter-spacing:5px; font-family:'Courier New', monospace;">
                      ${codigo_reserva}
                  </span>
              </div>
          </div>

          <!-- DETALLES IDA -->
          ${bloqueVueloIda}

          <!-- DETALLES VUELTA -->
          ${bloqueVueloVuelta}

          <!-- ESTADO -->
          <div style="background:#fff7ed; padding:20px; border-left:4px solid #fb923c; border-radius:8px; margin:30px 0;">
              <h3 style="margin-top:0; color:#ea580c;">Estado de la Reserva</h3>
              <p><strong>Estado:</strong> ${estado_reserva}</p>
              <p><strong>Fecha de reserva:</strong> ${new Date(fecha_reserva).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Expira el:</strong> ${new Date(fecha_expiracion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Viajeros:</strong> ${cantidad_viajeros}</p>
              <p><strong>Trayecto:</strong> ${trayectoria === 'IDAVUELTA' ? 'Ida y Vuelta' : 'Solo Ida'}</p>
          </div>

          <!-- PRECIO DINÁMICO -->
          ${bloquePrecio}

          <p style="font-size:15px; line-height:1.6; margin-top:20px; color:#444;">
              Conserva este correo y tu código de reserva.  
              ${estado_reserva === 'PAGADA' 
                ? 'Podrás realizar el check-in 24h antes del vuelo.' 
                : 'Completa el pago antes de la fecha de expiración para confirmar tu reserva.'}  
              ¡Te deseamos un excelente viaje! ✨
          </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f8f9fa; padding:20px; text-align:center; font-size:13px; color:#999;">
          Aero Penguin Airlines © 2025  
      </div>
  </div>

  </body>
  </html>
  `

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: toEmail,
    subject: `✈️ Confirmación de Reserva · Código ${codigo_reserva}`,
    html: htmlContent
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Correo de reserva enviado a: ${toEmail}`)
    return true
  } catch (err) {
    console.error('❌ Error enviando confirmación:', err.message)
    return false
  }
}

// Nueva función para enviar confirmación de compra pagada
export async function sendPurchaseConfirmation(ownerEmail, viajeros, reserva) {
  const {
    codigo_reserva,
    clase_reserva,
    cantidad_viajeros,
    precio_total,
    fecha_reserva,
    trayectoria
  } = reserva

  // Cargar vuelo IDA
  const vueloIda = await reserva.getVuelo_ida()
  const rutaIda = await vueloIda.getRuta()
  const origenIda = await rutaIda.getOrigen()
  const destinoIda = await rutaIda.getDestino()

  // Preparar posible vuelo de vuelta
  let vueloVuelta = null
  let rutaVuelta = null
  let origenVuelta = null
  let destinoVuelta = null

  if (trayectoria === 'IDAVUELTA' && reserva.vuelo_vuelta_id) {
    vueloVuelta = await reserva.getVuelo_vuelta()
    rutaVuelta = await vueloVuelta.getRuta()
    origenVuelta = await rutaVuelta.getOrigen()
    destinoVuelta = await rutaVuelta.getDestino()
  }

  // -----------------------------
  // OBTENER INFORMACIÓN DE ASIENTOS
  // -----------------------------
  const segmentos = await SegmentoViaje.findAll({
    where: { reserva_id: reserva.id_reserva },
    include: [
      { model: Viajero },
      { model: Asiento }
    ]
  })

  // Construir HTML de asientos por trayecto
  const segmentosIda = segmentos.filter(seg => seg.trayecto === 'IDA')
  const segmentosVuelta = segmentos.filter(seg => seg.trayecto === 'VUELTA')

  const htmlAsientosIda = segmentosIda.length > 0 ? `
    <div style="margin-top:15px; padding:10px; background:#e0f2fe; border-radius:5px;">
      <p style="margin:5px 0; font-weight:bold; color:#0369a1;">Asientos asignados:</p>
      ${segmentosIda.map(seg => `
        <p style="margin:3px 0; font-size:14px;">
          • ${seg.viajero?.nombre || 'Viajero'} ${seg.viajero?.apellido || ''}: <strong>${seg.asiento?.asiento || 'Sin asignar'}</strong>
        </p>
      `).join('')}
    </div>
  ` : ''

  const htmlAsientosVuelta = segmentosVuelta.length > 0 ? `
    <div style="margin-top:15px; padding:10px; background:#dbeafe; border-radius:5px;">
      <p style="margin:5px 0; font-weight:bold; color:#1e40af;">Asientos asignados:</p>
      ${segmentosVuelta.map(seg => `
        <p style="margin:3px 0; font-size:14px;">
          • ${seg.viajero?.nombre || 'Viajero'} ${seg.viajero?.apellido || ''}: <strong>${seg.asiento?.asiento || 'Sin asignar'}</strong>
        </p>
      `).join('')}
    </div>
  ` : ''

  // -----------------------------
  // BLOQUE DEL VUELO IDA
  // -----------------------------

  const bloqueVueloIda = `
    <div style="background:#f8fafc; padding:20px; border-radius:10px; margin-top:20px;">
        <h3 style="margin-top:0; color:#0ea5e9;">✈️ Vuelo de IDA</h3>
        <p><strong>Ruta:</strong> ${origenIda.nombre_ciudad} → ${destinoIda.nombre_ciudad}</p>
        <p><strong>Fecha:</strong> ${new Date(vueloIda.fecha_vuelo).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Hora de salida:</strong> ${new Date(vueloIda.hora_salida_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Clase:</strong> ${clase_reserva}</p>
        ${htmlAsientosIda}
    </div>
  `

  const bloqueVueloVuelta = vueloVuelta ? `
    <div style="background:#f1f5f9; padding:20px; border-radius:10px; margin-top:20px;">
        <h3 style="margin-top:0; color:#0284c7;">🔁 Vuelo de VUELTA</h3>
        <p><strong>Ruta:</strong> ${origenVuelta.nombre_ciudad} → ${destinoVuelta.nombre_ciudad}</p>
        <p><strong>Fecha:</strong> ${new Date(vueloVuelta.fecha_vuelo).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Hora de salida:</strong> ${new Date(vueloVuelta.hora_salida_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Clase:</strong> ${clase_reserva}</p>
        ${htmlAsientosVuelta}
    </div>
  ` : ''

  // -----------------------------
  // ENVIAR A TODOS LOS VIAJEROS
  // -----------------------------
  
  const emailsViajeros = viajeros
    .filter(v => v.correo_electronico && v.correo_electronico.trim() !== '')
    .map(v => v.correo_electronico)

  console.log(`📧 Enviando tickets a ${emailsViajeros.length} viajeros...`)

  for (const emailViajero of emailsViajeros) {
    const htmlViajero = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tu Ticket de Vuelo</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f4f8;">
    
    <div style="max-width:700px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    
        <!-- HEADER -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color:white; padding:30px; text-align:center;">
            <h1 style="margin:0; font-size:28px;">🎫 Tu Ticket de Vuelo</h1>
            <p style="margin-top:8px; opacity:0.9; font-size:16px;">Aero Penguin Airlines</p>
        </div>
    
        <!-- BODY -->
        <div style="padding:35px; color:#333;">
    
            <h2 style="color:#059669; margin-top:0;">¡Tu vuelo está confirmado y pagado!</h2>
            <p style="font-size:16px; line-height:1.6; color:#555;">
                Gracias por volar con <strong>Aero Penguin</strong>. Este es tu ticket confirmado.
            </p>
    
            <!-- CÓDIGO -->
            <div style="background:linear-gradient(135deg, #10b981, #059669); padding:20px; border-radius:10px; text-align:center; margin:25px 0; color:white;">
                <p style="margin:0; font-size:14px;">Código de Reserva</p>
                <div style="background:white; padding:15px 40px; border-radius:8px; margin-top:10px; display:inline-block;">
                    <span style="font-size:30px; font-weight:bold; color:#059669; letter-spacing:5px; font-family:'Courier New', monospace;">
                        ${codigo_reserva}
                    </span>
                </div>
            </div>
    
            ${bloqueVueloIda}
            ${bloqueVueloVuelta}
    
            <div style="background:#ecfdf5; padding:20px; border-left:4px solid #10b981; border-radius:8px; margin:30px 0;">
                <h3 style="margin-top:0; color:#059669;">✅ Compra Confirmada</h3>
                <p><strong>Estado:</strong> PAGADA</p>
                <p><strong>Total pagado:</strong> $${precio_total}</p>
                <p><strong>Fecha de compra:</strong> ${new Date(fecha_reserva).toLocaleDateString('es-ES')}</p>
                <p><strong>Viajeros:</strong> ${cantidad_viajeros}</p>
            </div>
    
            <p style="font-size:15px; line-height:1.6; margin-top:20px; color:#444;">
                Podrás realizar el check-in 24 horas antes del vuelo.  
                Conserva este correo como comprobante. ¡Buen viaje! ✈️✨
            </p>
        </div>
    
        <!-- FOOTER -->
        <div style="background:#f8f9fa; padding:20px; text-align:center; font-size:13px; color:#999;">
            Aero Penguin Airlines © 2025
        </div>
    </div>
    
    </body>
    </html>
    `

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: emailViajero,
      subject: `🎫 Tu Ticket de Vuelo · ${codigo_reserva}`,
      html: htmlViajero
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`✅ Ticket enviado a: ${emailViajero}`)
    } catch (err) {
      console.error(`❌ Error enviando ticket a ${emailViajero}:`, err.message)
    }
  }

  // -----------------------------
  // NOTIFICACIÓN AL DUEÑO DE LA CUENTA
  // -----------------------------

  const htmlOwner = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Compra Confirmada</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f4f8;">
  
  <div style="max-width:700px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
  
      <!-- HEADER -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color:white; padding:30px; text-align:center;">
          <h1 style="margin:0; font-size:28px;">💳 Compra Confirmada</h1>
          <p style="margin-top:8px; opacity:0.9; font-size:16px;">Aero Penguin Airlines</p>
      </div>
  
      <!-- BODY -->
      <div style="padding:35px; color:#333;">
  
          <h2 style="color:#059669; margin-top:0;">¡Pago procesado exitosamente!</h2>
          <p style="font-size:16px; line-height:1.6; color:#555;">
              Tu compra ha sido confirmada y todos los pasajeros han recibido sus tickets por correo electrónico.
          </p>
  
          <!-- CÓDIGO -->
          <div style="background:linear-gradient(135deg, #10b981, #059669); padding:20px; border-radius:10px; text-align:center; margin:25px 0; color:white;">
              <p style="margin:0; font-size:14px;">Código de Reserva</p>
              <div style="background:white; padding:15px 40px; border-radius:8px; margin-top:10px; display:inline-block;">
                  <span style="font-size:30px; font-weight:bold; color:#059669; letter-spacing:5px; font-family:'Courier New', monospace;">
                      ${codigo_reserva}
                  </span>
              </div>
          </div>
  
          ${bloqueVueloIda}
          ${bloqueVueloVuelta}
  
          <div style="background:#ecfdf5; padding:20px; border-left:4px solid #10b981; border-radius:8px; margin:30px 0;">
              <h3 style="margin-top:0; color:#059669;">Resumen de Pago</h3>
              <p style="font-size:22px; font-weight:bold; color:#059669; margin:5px 0;">
                  Total pagado: $${precio_total}
              </p>
              <p><strong>Viajeros:</strong> ${cantidad_viajeros}</p>
              <p><strong>Fecha de compra:</strong> ${new Date(fecha_reserva).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
  
          <p style="font-size:15px; line-height:1.6; margin-top:20px; color:#444;">
              Todos los pasajeros han recibido sus tickets individuales.  
              Puedes realizar el check-in 24 horas antes del vuelo. ¡Gracias por tu compra! 🎉
          </p>
      </div>
  
      <!-- FOOTER -->
      <div style="background:#f8f9fa; padding:20px; text-align:center; font-size:13px; color:#999;">
          Aero Penguin Airlines © 2025
      </div>
  </div>
  
  </body>
  </html>
  `

  const mailOptionsOwner = {
    from: process.env.MAIL_FROM,
    to: ownerEmail,
    subject: `💳 Compra Confirmada · ${codigo_reserva} - ${cantidad_viajeros} Pasajeros`,
    html: htmlOwner
  }

  try {
    await transporter.sendMail(mailOptionsOwner)
    console.log(`✅ Notificación de compra enviada al dueño: ${ownerEmail}`)
    return true
  } catch (err) {
    console.error(`❌ Error enviando notificación al dueño:`, err.message)
    return false
  }
}
