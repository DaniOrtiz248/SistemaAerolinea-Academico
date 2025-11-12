import { getFlightDuration, calculateArrivalTime, formatDuration } from '../config/flightDurations.js';

/**
 * Obtener la duración estimada entre dos ciudades
 * @route GET /api/v1/flight-durations/duration?origen=X&destino=Y
 */
export const getDuration = (req, res) => {
  try {
    const { origen, destino } = req.query;
    
    if (!origen || !destino) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los parámetros "origen" y "destino"'
      });
    }
    
    const duration = getFlightDuration(origen, destino);
    
    if (duration === null) {
      return res.status(404).json({
        success: false,
        error: `No existe una ruta entre ${origen} y ${destino}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        origen,
        destino,
        duracion_minutos: duration,
        duracion_formateada: formatDuration(duration)
      }
    });
  } catch (error) {
    console.error('Error al obtener duración:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la duración del vuelo'
    });
  }
};

/**
 * Calcular hora de llegada
 * @route POST /api/v1/flight-durations/calculate-arrival
 */
export const calculateArrival = (req, res) => {
  try {
    const { origen, destino, hora_salida } = req.body;
    
    if (!origen || !destino || !hora_salida) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los campos "origen", "destino" y "hora_salida"'
      });
    }
    
    const horaLlegada = calculateArrivalTime(origen, destino, hora_salida);
    
    if (!horaLlegada) {
      return res.status(404).json({
        success: false,
        error: `No existe una ruta entre ${origen} y ${destino}`
      });
    }
    
    const duration = getFlightDuration(origen, destino);
    
    res.status(200).json({
      success: true,
      data: {
        origen,
        destino,
        hora_salida,
        hora_llegada: horaLlegada.toISOString(),
        duracion_minutos: duration,
        duracion_formateada: formatDuration(duration)
      }
    });
  } catch (error) {
    console.error('Error al calcular llegada:', error);
    res.status(500).json({
      success: false,
      error: 'Error al calcular la hora de llegada'
    });
  }
};

export default {
  getDuration,
  calculateArrival
};
