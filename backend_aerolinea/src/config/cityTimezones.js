/**
 * Mapeo de ciudades a sus zonas horarias IANA
 * No requiere modificar la base de datos
 * 
 * Para agregar una nueva ciudad:
 * 1. Busca su zona horaria en: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * 2. Agrega el nombre de la ciudad (exactamente como está en la BD) y su timezone
 */

export const CITY_TIMEZONES = {
  // Colombia - Todas las ciudades colombianas
  'Bogotá': 'America/Bogota',
  'Bogota': 'America/Bogota',
  'Medellín': 'America/Bogota',
  'Medellin': 'America/Bogota',
  'Cali': 'America/Bogota',
  'Barranquilla': 'America/Bogota',
  'Cartagena': 'America/Bogota',
  'Bucaramanga': 'America/Bogota',
  'Pereira': 'America/Bogota',
  'Santa Marta': 'America/Bogota',
  'Cúcuta': 'America/Bogota',
  'Manizales': 'America/Bogota',
  'Ibagué': 'America/Bogota',
  'Pasto': 'America/Bogota',
  'Neiva': 'America/Bogota',
  'Armenia': 'America/Bogota',
  'Villavicencio': 'America/Bogota',
  'Valledupar': 'America/Bogota',
  
  // Estados Unidos - Costa Este (UTC-5 / UTC-4 DST)
  'Miami': 'America/New_York',
  'New York': 'America/New_York',
  'Nueva York': 'America/New_York',
  'Washington': 'America/New_York',
  'Boston': 'America/New_York',
  'Orlando': 'America/New_York',
  'Atlanta': 'America/New_York',
  'Philadelphia': 'America/New_York',
  'Filadelfia': 'America/New_York',
  
  // Estados Unidos - Costa Oeste (UTC-8 / UTC-7 DST)
  'Los Angeles': 'America/Los_Angeles',
  'Los Ángeles': 'America/Los_Angeles',
  'San Francisco': 'America/Los_Angeles',
  'Seattle': 'America/Los_Angeles',
  'San Diego': 'America/Los_Angeles',
  'Portland': 'America/Los_Angeles',
  'Las Vegas': 'America/Los_Angeles',
  
  // Estados Unidos - Centro (UTC-6 / UTC-5 DST)
  'Chicago': 'America/Chicago',
  'Houston': 'America/Chicago',
  'Dallas': 'America/Chicago',
  'San Antonio': 'America/Chicago',
  'Austin': 'America/Chicago',
  
  // Estados Unidos - Montaña (UTC-7 / UTC-6 DST)
  'Denver': 'America/Denver',
  'Phoenix': 'America/Phoenix', // No usa DST
  
  // México (UTC-6 / UTC-5 DST)
  'México': 'America/Mexico_City',
  'Ciudad de México': 'America/Mexico_City',
  'Guadalajara': 'America/Mexico_City',
  'Monterrey': 'America/Mexico_City',
  'Cancún': 'America/Cancun',
  'Tijuana': 'America/Tijuana',
  
  // España (UTC+1 / UTC+2 DST)
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Valencia': 'Europe/Madrid',
  'Sevilla': 'Europe/Madrid',
  'Málaga': 'Europe/Madrid',
  
  // Francia (UTC+1 / UTC+2 DST)
  'París': 'Europe/Paris',
  'Paris': 'Europe/Paris',
  'Lyon': 'Europe/Paris',
  'Marsella': 'Europe/Paris',
  
  // Reino Unido (UTC+0 / UTC+1 DST)
  'Londres': 'Europe/London',
  'London': 'Europe/London',
  'Manchester': 'Europe/London',
  'Liverpool': 'Europe/London',
  
  // Italia (UTC+1 / UTC+2 DST)
  'Roma': 'Europe/Rome',
  'Milán': 'Europe/Rome',
  'Milan': 'Europe/Rome',
  'Venecia': 'Europe/Rome',
  'Florencia': 'Europe/Rome',
  
  // Alemania (UTC+1 / UTC+2 DST)
  'Berlín': 'Europe/Berlin',
  'Berlin': 'Europe/Berlin',
  'Múnich': 'Europe/Berlin',
  'Frankfurt': 'Europe/Berlin',
  
  // Argentina (UTC-3)
  'Buenos Aires': 'America/Argentina/Buenos_Aires',
  'Córdoba': 'America/Argentina/Cordoba',
  'Mendoza': 'America/Argentina/Mendoza',
  
  // Brasil (múltiples zonas)
  'São Paulo': 'America/Sao_Paulo',
  'Rio de Janeiro': 'America/Sao_Paulo',
  'Brasília': 'America/Sao_Paulo',
  'Manaus': 'America/Manaus',
  
  // Perú (UTC-5)
  'Lima': 'America/Lima',
  'Cusco': 'America/Lima',
  
  // Chile (UTC-4 / UTC-3 DST)
  'Santiago': 'America/Santiago',
  
  // Ecuador (UTC-5)
  'Quito': 'America/Guayaquil',
  'Guayaquil': 'America/Guayaquil',
  
  // Panamá (UTC-5)
  'Panamá': 'America/Panama',
  'Ciudad de Panamá': 'America/Panama',
  
  // Costa Rica (UTC-6)
  'San José': 'America/Costa_Rica',
  
  // Asia - Japón (UTC+9)
  'Tokyo': 'Asia/Tokyo',
  'Tokio': 'Asia/Tokyo',
  'Osaka': 'Asia/Tokyo',
  
  // Asia - China (UTC+8)
  'Beijing': 'Asia/Shanghai',
  'Shanghai': 'Asia/Shanghai',
  'Hong Kong': 'Asia/Hong_Kong',
  
  // Asia - Emiratos Árabes (UTC+4)
  'Dubai': 'Asia/Dubai',
  'Abu Dhabi': 'Asia/Dubai',
  
  // Asia - Singapur (UTC+8)
  'Singapore': 'Asia/Singapore',
  'Singapur': 'Asia/Singapore',
  
  // Asia - India (UTC+5:30)
  'Mumbai': 'Asia/Kolkata',
  'Nueva Delhi': 'Asia/Kolkata',
  'Delhi': 'Asia/Kolkata',
  
  // Oceanía - Australia (múltiples zonas)
  'Sydney': 'Australia/Sydney',
  'Melbourne': 'Australia/Melbourne',
  'Brisbane': 'Australia/Brisbane',
  
  // Canadá
  'Toronto': 'America/Toronto',
  'Vancouver': 'America/Vancouver',
  'Montreal': 'America/Montreal',
}

/**
 * Obtiene la zona horaria de una ciudad
 * @param {string} cityName - Nombre de la ciudad
 * @returns {string} - Zona horaria IANA o 'America/Bogota' por defecto
 */
export function getCityTimezone(cityName) {
  if (!cityName) return 'America/Bogota'
  
  // Buscar coincidencia exacta (case-insensitive)
  const timezone = CITY_TIMEZONES[cityName]
  if (timezone) return timezone
  
  // Buscar coincidencia sin importar mayúsculas/minúsculas
  const normalizedName = cityName.toLowerCase()
  const found = Object.keys(CITY_TIMEZONES).find(
    key => key.toLowerCase() === normalizedName
  )
  
  if (found) return CITY_TIMEZONES[found]
  
  // Por defecto, Colombia (útil para ciudades no mapeadas)
  console.warn(`⚠️ Ciudad "${cityName}" no tiene timezone mapeada, usando America/Bogota por defecto`)
  return 'America/Bogota'
}

/**
 * Obtiene la zona horaria de una ciudad desde el objeto ciudad
 * @param {object} ciudad - Objeto ciudad con nombre_ciudad
 * @returns {string} - Zona horaria IANA
 */
export function getTimezoneFromCity(ciudad) {
  // Si el modelo ya tiene el campo timezone (por si decides agregarlo después)
  if (ciudad?.timezone) return ciudad.timezone
  
  // Usar el mapeo
  return getCityTimezone(ciudad?.nombre_ciudad)
}
