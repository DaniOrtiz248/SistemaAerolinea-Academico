/**
 * Utilidad para manejar conversiones de zona horaria en vuelos
 * Requiere: npm install date-fns date-fns-tz
 * NO REQUIERE modificar la base de datos - usa mapeo de ciudades
 */

import { format } from 'date-fns'
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz'
import { getTimezoneFromCity } from '../config/cityTimezones.js'

/**
 * Convierte una hora local a la zona horaria de destino
 * @param {string} dateTimeStr - Fecha/hora en formato ISO o YYYY-MM-DD HH:MM:SS
 * @param {string} fromTimezone - Zona horaria origen (ej: 'America/Bogota')
 * @param {string} toTimezone - Zona horaria destino (ej: 'America/New_York')
 * @returns {object} - { originalTime, convertedTime, difference }
 */
export function convertTimezone(dateTimeStr, fromTimezone, toTimezone) {
  try {
    // Parsear la fecha/hora asumiendo que está en la zona horaria de origen
    const dateInOriginZone = fromZonedTime(dateTimeStr, fromTimezone)
    
    // Convertir a la zona horaria de destino
    const dateInDestinationZone = toZonedTime(dateInOriginZone, toTimezone)
    
    return {
      originalTime: formatInTimeZone(dateInOriginZone, fromTimezone, 'yyyy-MM-dd HH:mm:ss'),
      convertedTime: formatInTimeZone(dateInDestinationZone, toTimezone, 'yyyy-MM-dd HH:mm:ss'),
      utc: dateInOriginZone.toISOString(),
      difference: getTimeDifference(fromTimezone, toTimezone)
    }
  } catch (error) {
    console.error('Error converting timezone:', error)
    throw error
  }
}

/**
 * Calcula la diferencia horaria entre dos zonas horarias
 * @param {string} timezone1 
 * @param {string} timezone2 
 * @returns {string} - Diferencia en formato legible (ej: "+3 horas", "-5 horas")
 */
export function getTimeDifference(timezone1, timezone2) {
  const now = new Date()
  
  // Obtener los offsets usando formatInTimeZone
  const offset1 = formatInTimeZone(now, timezone1, 'XXX')
  const offset2 = formatInTimeZone(now, timezone2, 'XXX')
  
  // Convertir offsets a minutos
  const parseOffset = (offset) => {
    const match = offset.match(/([+-])(\d{2}):(\d{2})/)
    if (!match) return 0
    const sign = match[1] === '+' ? 1 : -1
    const hours = parseInt(match[2])
    const minutes = parseInt(match[3])
    return sign * (hours * 60 + minutes)
  }
  
  const diff = parseOffset(offset2) - parseOffset(offset1)
  const hours = Math.floor(Math.abs(diff) / 60)
  const minutes = Math.abs(diff) % 60
  
  let result = ''
  if (diff > 0) result = '+'
  else if (diff < 0) result = '-'
  else return '0 horas'
  
  if (minutes > 0) {
    return `${result}${hours}:${minutes.toString().padStart(2, '0')} horas`
  }
  return `${result}${hours} hora${hours !== 1 ? 's' : ''}`
}

/**
 * Formatea una fecha en una zona horaria específica
 * @param {Date|string} date 
 * @param {string} timezone 
 * @param {string} formatStr - Formato deseado (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns {string}
 */
export function formatInTimezone(date, timezone, formatStr = 'yyyy-MM-dd HH:mm:ss') {
  return formatInTimeZone(date, timezone, formatStr)
}

/**
 * Calcula la hora de llegada en la zona horaria de destino
 * @param {object} flight - Objeto vuelo con ruta.origen y ruta.destino
 * @returns {object} - Información de horarios en ambas zonas
 */
export function calculateFlightTimes(flight) {
  // Obtener zonas horarias usando el mapeo de ciudades (NO requiere campo en BD)
  const origenTimezone = getTimezoneFromCity(flight.ruta?.origen)
  const destinoTimezone = getTimezoneFromCity(flight.ruta?.destino)
  
  // Parsear la hora de salida como si estuviera en la zona horaria de origen
  const salidaDate = fromZonedTime(flight.hora_salida_vuelo, origenTimezone)
  
  // Parsear la hora de llegada como si estuviera en la zona horaria de origen también
  // (porque se guardó en BD pensando en el tiempo del origen)
  const llegadaDate = fromZonedTime(flight.hora_llegada_vuelo, origenTimezone)
  
  // Hora de salida en zona de origen (debería ser la misma)
  const salidaHora = formatInTimeZone(salidaDate, origenTimezone, 'HH:mm')
  const salidaFecha = formatInTimeZone(salidaDate, origenTimezone, 'yyyy-MM-dd')
  
  // Hora de llegada CONVERTIDA a zona de destino
  const llegadaHora = formatInTimeZone(llegadaDate, destinoTimezone, 'HH:mm')
  const llegadaFecha = formatInTimeZone(llegadaDate, destinoTimezone, 'yyyy-MM-dd')
  
  // Obtener offset para mostrar
  const origenOffset = formatInTimeZone(new Date(), origenTimezone, 'XXX')
  const destinoOffset = formatInTimeZone(new Date(), destinoTimezone, 'XXX')
  
  return {
    salida: {
      hora: salidaHora,
      fecha: salidaFecha,
      timezone: origenTimezone,
      timezone_corto: origenTimezone.split('/')[1],
      offset: origenOffset,
      ciudad: flight.ruta?.origen?.nombre_ciudad
    },
    llegada: {
      hora: llegadaHora,
      fecha: llegadaFecha,
      timezone: destinoTimezone,
      timezone_corto: destinoTimezone.split('/')[1],
      offset: destinoOffset,
      ciudad: flight.ruta?.destino?.nombre_ciudad
    },
    diferencia_horaria: getTimeDifference(origenTimezone, destinoTimezone),
    es_internacional: flight.ruta?.es_nacional === 0
  }
}

// Exportar también el mapeo de ciudades para referencia
export { CITY_TIMEZONES, getCityTimezone } from '../config/cityTimezones.js'
