"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCityTimezone } from "../../utils/timezones";

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [flightDetails, setFlightDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [ciudades, setCiudades] = useState([]);
  // Inicialización avanzada para destino
  const paramDestino = searchParams.get('destination');
  const paramNombreCiudad = searchParams.get('ciudadNombre');
  const [selectedOrigin, setSelectedOrigin] = useState(searchParams.get('origin') || "");
  const [selectedDestination, setSelectedDestination] = useState(paramDestino || "");
  const [selectedDestinationName, setSelectedDestinationName] = useState(paramNombreCiudad || "");
  const [selectedDate, setSelectedDate] = useState(searchParams.get('departureDate') || "");
  const [selectedArrivalDate, setSelectedArrivalDate] = useState(searchParams.get('arrivalDate') || "");
  const [filterDescuento, setFilterDescuento] = useState(searchParams.get('descuento') || "0");

  // Función para formatear hora con timezone
  const formatTimeWithTimezone = (dateString, ciudad) => {
    if (!dateString || !ciudad) return null;
    
    const date = new Date(dateString);
    const offset = getCityTimezone(ciudad);
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    
    // Ajustar la hora según el offset de la ciudad
    const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    
    // Hora local ajustada al timezone de la ciudad
    const horaLocal = localDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
    
    return {
      local: horaLocal,
      offset: offsetStr,
      fecha: localDate.toLocaleDateString('es-ES', { timeZone: 'UTC' })
    };
  };

  // Función para calcular llegada y duración
  const calcularDetallesVuelo = async (flight) => {
    if (!flight.hora_salida_vuelo || !flight.ruta?.origen?.nombre_ciudad || !flight.ruta?.destino?.nombre_ciudad) {
      return null;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/flight-durations/duration?origen=${encodeURIComponent(flight.ruta.origen.nombre_ciudad)}&destino=${encodeURIComponent(flight.ruta.destino.nombre_ciudad)}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const minutos = result.data.duracion_minutos;
          const salidaDate = new Date(flight.hora_salida_vuelo);
          const llegadaDate = new Date(salidaDate.getTime() + minutos * 60000);
          
          const horas = Math.floor(minutos / 60);
          const mins = minutos % 60;
          let duracionTexto = '';
          if (horas === 0) duracionTexto = `${mins}min`;
          else if (mins === 0) duracionTexto = `${horas}h`;
          else duracionTexto = `${horas}h ${mins}min`;

          return {
            llegada: llegadaDate.toISOString(),
            duracion: duracionTexto,
            duracionMinutos: minutos
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error calculando detalles:', error);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    // Obtener vuelos
    fetch("http://localhost:3001/api/v1/flights")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setFlights(result.data);
          // Calcular detalles de cada vuelo
          result.data.forEach(async (flight) => {
            const detalles = await calcularDetallesVuelo(flight);
            if (detalles) {
              setFlightDetails(prev => ({
                ...prev,
                [flight.ccv]: detalles
              }));
            }
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // Obtener ciudades
    fetch("http://localhost:3001/api/v1/ciudades")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setCiudades(result.data);
          // Si el filtro es por nombre y no hay id, buscar el id por nombre
          if (paramNombreCiudad && !paramDestino) {
            const ciudadObj = result.data.find(c => c.nombre_ciudad.toLowerCase() === paramNombreCiudad.toLowerCase());
            if (ciudadObj) {
              setSelectedDestination(ciudadObj.id_ciudad);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          ✈️ Vuelos Disponibles
        </h2>
  <div className="max-w-2xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descuento</label>
            <select
              value={filterDescuento}
              onChange={e => setFilterDescuento(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="0">Todos</option>
              <option value="1">Solo con descuento</option>
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de llegada</label>
            <input
              type="date"
              value={selectedArrivalDate}
              onChange={e => setSelectedArrivalDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
            <select
              value={selectedOrigin}
              onChange={e => setSelectedOrigin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="">Todas las ciudades</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>{ciudad.nombre_ciudad}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
            <select
              value={selectedDestination}
              onChange={e => setSelectedDestination(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="">Todas las ciudades</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>{ciudad.nombre_ciudad}</option>
              ))}
              {/* Si no existe la ciudad en la lista pero hay nombre, mostrar opción extra */}
              {selectedDestination === "" && selectedDestinationName && !ciudades.some(c => c.nombre_ciudad.toLowerCase() === selectedDestinationName.toLowerCase()) && (
           <option value="">{selectedDestinationName}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de salida</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar texto</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ciudad, destino o código de ruta..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando vuelos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.filter(flight => {
              // Filtrar por descuento
              if (filterDescuento === "1" && !(flight.porcentaje_promocion && flight.porcentaje_promocion > 0)) {
                return false;
              }
              // Filtrar por fecha de llegada
              if (selectedArrivalDate) {
                // Ya no hay campo hora_llegada_vuelo, se puede usar fecha_vuelo o eliminar este filtro
                return false;
              }
              // Filtrar por origen
              if (selectedOrigin && String(flight.ruta?.origen?.id_ciudad) !== String(selectedOrigin)) {
                return false;
              }
              // Filtrar por destino
              if (selectedDestination && String(flight.ruta?.destino?.id_ciudad) !== String(selectedDestination)) {
                return false;
              }
              // Filtrar por fecha (local)
              if (selectedDate) {
                const flightDate = flight.fecha_vuelo ? new Date(flight.fecha_vuelo).toLocaleDateString('en-CA') : "";
                if (flightDate !== selectedDate) {
                  return false;
                }
              }
              // Filtrar por texto
              const term = search.trim().toLowerCase();
              if (!term) return true;
              return (
                flight.ruta?.origen?.nombre_ciudad?.toLowerCase().includes(term) ||
                flight.ruta?.destino?.nombre_ciudad?.toLowerCase().includes(term) ||
                flight.ruta?.codigo_ruta?.toLowerCase().includes(term) ||
                String(flight.ccv).includes(term)
              );
            }).map((flight) => {
              const detalles = flightDetails[flight.ccv];
              const salidaTimezone = flight.hora_salida_vuelo ? formatTimeWithTimezone(
                flight.hora_salida_vuelo,
                flight.ruta?.origen?.nombre_ciudad
              ) : null;
              const llegadaTimezone = detalles?.llegada ? formatTimeWithTimezone(
                detalles.llegada,
                flight.ruta?.destino?.nombre_ciudad
              ) : null;
              
              return (
              <div key={flight.ccv} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Vuelo #{flight.ccv}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      flight.estado === 1 ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"
                    }`}>
                      {flight.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        flight.ruta?.es_nacional ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {flight.ruta?.es_nacional ? "🇵🇪 Nacional" : "🌎 Internacional"}
                      </span>
                      <span className="text-sm text-gray-500">Ruta: {flight.ruta?.codigo_ruta}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">🛫 Origen:</span>
                      <span>{flight.ruta?.origen?.nombre_ciudad || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">🛬 Destino:</span>
                      <span>{flight.ruta?.destino?.nombre_ciudad || "N/A"}</span>
                    </div>
                    {flight.fecha_vuelo && (
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">📅 Fecha:</span>
                        <span>{new Date(flight.fecha_vuelo).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                    
                    {/* Comparación de Horas: Salida y Llegada */}
                    {flight.hora_salida_vuelo && salidaTimezone && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-300 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Salida */}
                          <div className="bg-white rounded-lg p-3 border border-blue-200">
                            <div className="text-xs font-semibold text-gray-600 mb-1">Salida</div>
                            <div className="text-lg font-bold text-blue-700">{salidaTimezone.local}</div>
                            <div className="text-xs text-blue-600 mt-1">
                              📍 {flight.ruta?.origen?.nombre_ciudad}
                            </div>
                            <div className="text-xs text-gray-500">
                              (UTC{salidaTimezone.offset})
                            </div>
                          </div>
                          
                          {/* Llegada */}
                          {detalles?.llegada && llegadaTimezone ? (
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <div className="text-xs font-semibold text-gray-600 mb-1">Llegada</div>
                              <div className="text-lg font-bold text-purple-700">{llegadaTimezone.local}</div>
                              <div className="text-xs text-purple-600 mt-1">
                                📍 {flight.ruta?.destino?.nombre_ciudad}
                              </div>
                              <div className="text-xs text-gray-500">
                                (UTC{llegadaTimezone.offset})
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">Calculando...</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Línea de diferencia horaria */}
                        {detalles?.llegada && llegadaTimezone && (
                          <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                            <span className="text-xs text-gray-600">
                              Diferencia: <span className="font-semibold text-gray-800">
                                {Math.abs(parseInt(salidaTimezone.offset) - parseInt(llegadaTimezone.offset))} horas
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Duración del vuelo */}
                    {detalles?.duracion && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center text-gray-700">
                          <span className="font-semibold mr-2">⏱️ Duración:</span>
                          <span className="text-lg font-bold text-gray-700">{detalles.duracion}</span>
                        </div>
                      </div>
                    )}
                    
                    {flight.porcentaje_promocion && flight.porcentaje_promocion > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                        <span className="text-yellow-700 font-semibold">🎉 {flight.porcentaje_promocion}% de descuento</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Primera Clase:</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${flight.porcentaje_promocion 
                            ? (flight.ruta?.precio_primer_clase * (1 - flight.porcentaje_promocion / 100)).toFixed(2)
                            : flight.ruta?.precio_primer_clase}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Segunda Clase:</span>
                        <span className="text-lg font-bold text-green-600">
                          ${flight.porcentaje_promocion 
                            ? (flight.ruta?.precio_segunda_clase * (1 - flight.porcentaje_promocion / 100)).toFixed(2)
                            : flight.ruta?.precio_segunda_clase}
                        </span>
                      </div>
                    </div>
                  </div>
                  {flight.estado === 1 ? (
                    <Link href={`/booking/${flight.ccv}`}>
                      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md">
                        Reservar Ahora
                      </button>
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="w-full mt-4 bg-gray-400 text-gray-800 cursor-not-allowed opacity-60 font-bold py-3 px-4 rounded-lg shadow-md"
                    >
                      No Disponible
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}


