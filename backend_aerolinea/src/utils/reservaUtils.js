// utils/reservaUtils.js
import Reserva from '../models/reserva.js';
import { Op } from 'sequelize';

/**
 * Calcula la fecha de expiración de una reserva (24 horas desde la creación)
 * @param {Date} fechaCreacion - Fecha de creación de la reserva
 * @returns {Date} Fecha de expiración
 */
export function calcularExpiracionReserva(fechaCreacion = new Date()) {
  const expiracion = new Date(fechaCreacion);
  expiracion.setHours(expiracion.getHours() + 24);
  return expiracion;
}

/**
 * Verifica si una reserva ha expirado
 * @param {Date} fechaExpiracion - Fecha de expiración de la reserva
 * @returns {boolean} true si la reserva ha expirado, false si aún está vigente
 */
export function reservaExpirada(fechaExpiracion) {
  return new Date() > new Date(fechaExpiracion);
}

/**
 * Genera un código único para la reserva
 * Formato: RES-YYYYMMDD-XXXXX (donde XXXXX es un número secuencial)
 * @returns {Promise<string>} Código de reserva generado
 */
export async function generarCodigoReserva() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  const fechaStr = `${year}${month}${day}`;

  // Buscar todas las reservas del día para obtener el siguiente número
  const inicioDelDia = new Date(hoy.setHours(0, 0, 0, 0));
  const finDelDia = new Date(hoy.setHours(23, 59, 59, 999));

  const reservas = await Reserva.findAll({
    where: {
      codigo_reserva: {
        [Op.like]: `RES-${fechaStr}-%`
      }
    },
    attributes: ['codigo_reserva'],
    order: [['codigo_reserva', 'DESC']]
  });

  let siguienteNumero = 1;

  if (reservas && reservas.length > 0) {
    // Extraer el número más alto del día
    const numeros = reservas
      .map(r => {
        const match = r.codigo_reserva.match(/^RES-\d{8}-(\d{5})$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0)
      .sort((a, b) => b - a);

    if (numeros.length > 0) {
      siguienteNumero = numeros[0] + 1;
    }
  }

  // Formatear con ceros a la izquierda (5 dígitos)
  const numeroFormateado = String(siguienteNumero).padStart(5, '0');
  const codigoReserva = `RES-${fechaStr}-${numeroFormateado}`;

  // Verificar que el código no exista (seguridad adicional)
  const existente = await Reserva.findOne({
    where: { codigo_reserva: codigoReserva }
  });

  if (existente) {
    console.warn(`Código ${codigoReserva} ya existe, generando siguiente...`);
    // Si existe, intentar con el siguiente número
    siguienteNumero++;
    const nuevoNumero = String(siguienteNumero).padStart(5, '0');
    return `RES-${fechaStr}-${nuevoNumero}`;
  }

  console.log(`Código de reserva generado: ${codigoReserva}`);
  return codigoReserva;
}

/**
 * Calcula el tiempo restante hasta la expiración en minutos
 * @param {Date} fechaExpiracion - Fecha de expiración de la reserva
 * @returns {number} Minutos restantes (0 si ya expiró)
 */
export function tiempoRestanteMinutos(fechaExpiracion) {
  const ahora = new Date();
  const expiracion = new Date(fechaExpiracion);
  const diferencia = expiracion - ahora;
  
  if (diferencia <= 0) {
    return 0;
  }
  
  return Math.floor(diferencia / (1000 * 60));
}

/**
 * Formatea el tiempo restante en formato legible
 * @param {Date} fechaExpiracion - Fecha de expiración de la reserva
 * @returns {string} Tiempo restante formateado (ej: "23h 45m")
 */
export function formatearTiempoRestante(fechaExpiracion) {
  const minutos = tiempoRestanteMinutos(fechaExpiracion);
  
  if (minutos <= 0) {
    return 'Expirado';
  }
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (horas > 0) {
    return `${horas}h ${mins}m`;
  }
  
  return `${mins}m`;
}
