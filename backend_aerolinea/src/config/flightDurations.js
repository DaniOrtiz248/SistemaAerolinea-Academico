/**
 * Grafo de duraciones de vuelos entre ciudades
 * Duraciones aproximadas en minutos entre ciudades
 */

const flightDurations = {
  // ============ PEREIRA ============
  'Pereira': {
    'Pereira': 0,
    'Bogotá': 50,
    'Bogota': 50,
    'Cali': 40,
    'Medellín': 35,
    'Medellin': 35,
    'Cartagena': 90,
    'Madrid': 660,
    'Londres': 720,
    'New York': 360,
    'Buenos Aires': 390,
    'Miami': 240
  },

  // ============ BOGOTÁ ============
  'Bogotá': {
    'Pereira': 50,
    'Bogotá': 0,
    'Bogota': 0,
    'Cali': 55,
    'Medellín': 50,
    'Medellin': 50,
    'Cartagena': 95,
    'Madrid': 600,
    'Londres': 630,
    'New York': 330,
    'Buenos Aires': 360,
    'Miami': 210
  },

  'Bogota': {
    'Pereira': 50,
    'Bogotá': 0,
    'Bogota': 0,
    'Cali': 55,
    'Medellín': 50,
    'Medellin': 50,
    'Cartagena': 95,
    'Madrid': 600,
    'Londres': 630,
    'New York': 330,
    'Buenos Aires': 360,
    'Miami': 210
  },

  // ============ CALI ============
  'Cali': {
    'Pereira': 40,
    'Bogotá': 55,
    'Bogota': 55,
    'Cali': 0,
    'Medellín': 50,
    'Medellin': 50,
    'Cartagena': 95,
    'Madrid': 600,
    'Londres': 690,
    'New York': 360,
    'Buenos Aires': 390,
    'Miami': 240
  },

  // ============ MEDELLÍN ============
  'Medellín': {
    'Pereira': 35,
    'Bogotá': 50,
    'Bogota': 50,
    'Cali': 50,
    'Medellín': 0,
    'Medellin': 0,
    'Cartagena': 80,
    'Madrid': 630,
    'Londres': 660,
    'New York': 330,
    'Buenos Aires': 375,
    'Miami': 210
  },

  'Medellin': {
    'Pereira': 35,
    'Bogotá': 50,
    'Bogota': 50,
    'Cali': 50,
    'Medellín': 0,
    'Medellin': 0,
    'Cartagena': 80,
    'Madrid': 630,
    'Londres': 660,
    'New York': 330,
    'Buenos Aires': 375,
    'Miami': 210
  },

  // ============ CARTAGENA ============
  'Cartagena': {
    'Pereira': 90,
    'Bogotá': 95,
    'Bogota': 95,
    'Cali': 95,
    'Medellín': 80,
    'Medellin': 80,
    'Cartagena': 0,
    'Madrid': 600,
    'Londres': 630,
    'New York': 270,
    'Buenos Aires': 390,
    'Miami': 150
  },

  // ============ MADRID ============
  'Madrid': {
    'Pereira': 660,
    'Bogotá': 600,
    'Bogota': 600,
    'Cali': 600,
    'Medellín': 630,
    'Medellin': 630,
    'Cartagena': 600,
    'Madrid': 0,
    'Londres': 135,
    'New York': 480,
    'Buenos Aires': 720,
    'Miami': 540
  },

  // ============ LONDRES ============
  'Londres': {
    'Pereira': 720,
    'Bogotá': 630,
    'Bogota': 630,
    'Cali': 690,
    'Medellín': 660,
    'Medellin': 660,
    'Cartagena': 630,
    'Madrid': 135,
    'Londres': 0,
    'New York': 450,
    'Buenos Aires': 825,
    'Miami': 570
  },

  // ============ NEW YORK ============
  'New York': {
    'Pereira': 360,
    'Bogotá': 330,
    'Bogota': 330,
    'Cali': 360,
    'Medellín': 330,
    'Medellin': 330,
    'Cartagena': 270,
    'Madrid': 480,
    'Londres': 450,
    'New York': 0,
    'Buenos Aires': 645,
    'Miami': 195
  },

  // ============ BUENOS AIRES ============
  'Buenos Aires': {
    'Pereira': 390,
    'Bogotá': 360,
    'Bogota': 360,
    'Cali': 390,
    'Medellín': 375,
    'Medellin': 375,
    'Cartagena': 390,
    'Madrid': 720,
    'Londres': 825,
    'New York': 645,
    'Buenos Aires': 0,
    'Miami': 540
  },

  // ============ MIAMI ============
  'Miami': {
    'Pereira': 240,
    'Bogotá': 210,
    'Bogota': 210,
    'Cali': 240,
    'Medellín': 210,
    'Medellin': 210,
    'Cartagena': 150,
    'Madrid': 540,
    'Londres': 570,
    'New York': 195,
    'Buenos Aires': 540,
    'Miami': 0
  }
};

/**
 * Obtiene la duración del vuelo entre dos ciudades
 * @param {string} origen - Ciudad de origen
 * @param {string} destino - Ciudad de destino
 * @returns {number|null} Duración en minutos, o null si no existe la ruta
 */
export const getFlightDuration = (origen, destino) => {
  if (!flightDurations[origen]) {
    return null;
  }
  return flightDurations[origen][destino] || null;
};

/**
 * Calcula la hora de llegada dado el origen, destino y hora de salida
 * @param {string} origen - Ciudad de origen
 * @param {string} destino - Ciudad de destino
 * @param {Date|string} horaSalida - Hora de salida
 * @returns {Date|null} Hora de llegada calculada
 */
export const calculateArrivalTime = (origen, destino, horaSalida) => {
  const duracion = getFlightDuration(origen, destino);
  
  if (duracion === null) {
    return null;
  }

  const salida = typeof horaSalida === 'string' ? new Date(horaSalida) : horaSalida;
  const llegada = new Date(salida);
  llegada.setMinutes(llegada.getMinutes() + duracion);
  
  return llegada;
};

/**
 * Formatea la hora de llegada al formato esperado por el backend
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada como "YYYY-MM-DD HH:MM:SS"
 */
export const formatToBackendDateTime = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  const seconds = '00';
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Convierte minutos a formato legible
 * @param {number} minutos - Duración en minutos
 * @returns {string} Duración formateada
 */
export const formatDuration = (minutos) => {
  if (minutos === 0) return '0min';
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (horas === 0) return `${mins}min`;
  if (mins === 0) return `${horas}h`;
  return `${horas}h ${mins}min`;
};

export { flightDurations };
export default flightDurations;
