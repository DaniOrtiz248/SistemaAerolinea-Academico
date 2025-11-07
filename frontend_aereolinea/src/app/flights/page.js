"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
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

  useEffect(() => {
    setLoading(true);
    // Obtener vuelos
    fetch("http://localhost:3001/api/v1/flights")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setFlights(result.data);
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
            }).map((flight) => (
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
                    {flight.hora_salida_vuelo && (
                      <div className="border-b border-gray-200 pb-3 mb-3">
                        <div className="flex items-center text-gray-700 mb-2">
                          <span className="font-semibold mr-2">🕐 Salida:</span>
                          <span>{new Date(flight.hora_salida_vuelo).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        {flight.timezone_info?.salida && (
                          <div className="ml-6 bg-blue-50 p-2 rounded">
                            <div className="text-sm font-semibold text-blue-700">
                              📍 {flight.timezone_info.salida.ciudad}
                            </div>
                            <div className="text-sm text-blue-600">
                              🕐 {flight.timezone_info.salida.hora}
                            </div>
                          </div>
                        )}
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
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md">
                    Reservar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
