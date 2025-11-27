const API_URL = 'http://localhost:3001/api/v1';

export const segmentoService = {
  // Obtener segmentos de viaje por reserva
  async getSegmentosByReservaId(reservaId) {
    try {
      const response = await fetch(`${API_URL}/segmentos-viaje/reserva/${reservaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los segmentos de viaje');
      }
      return data.data || data;
    } catch (error) {
      console.error('Error fetching segmentos:', error);
      throw error;
    }
  },
};
