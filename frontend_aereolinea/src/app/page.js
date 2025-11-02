'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundtrip'
  });


  useEffect(() => {
    setMounted(true);
    
    // Cargar ciudades disponibles
    const fetchCiudades = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/ciudades');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCiudades(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching ciudades:', error);
      }
    };
    fetchCiudades();
    
    // Verificar si el usuario es administrador y redirigirlo a su dashboard
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Si es administrador (id_rol === 2), redirigir a su dashboard
        if (parsedUser.id_rol === 2) {
          router.push('/admin');
          return;
        }
        
        // Si es usuario root (id_rol === 1), redirigir a su dashboard
        if (parsedUser.id_rol === 1) {
          router.push('/root/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Validar campos requeridos
    if (!searchData.origin || !searchData.destination) {
      alert('Por favor selecciona ciudad de origen y destino');
      return;
    }
    if (!searchData.departureDate) {
      alert('Por favor selecciona la fecha de salida');
      return;
    }
    // Redirigir a /flights con los parámetros
    const params = new URLSearchParams({
      origin: searchData.origin,
      destination: searchData.destination,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      tripType: searchData.tripType
    });
    router.push(`/flights?${params.toString()}`);
  };

  const handleViewFlights = async (destination = null) => {
    setLoadingFlights(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/flights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Flights data:', result);
        
        if (result.success && result.data) {
          setFlights(result.data);
          
          if (result.data.length > 0) {
            alert(`Se encontraron ${result.data.length} vuelos disponibles. Revisa la sección de vuelos más abajo.`);
            
            // Scroll suave a la sección de vuelos
            setTimeout(() => {
              const flightsSection = document.getElementById('flights-section');
              if (flightsSection) {
                flightsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 500);
          } else {
            alert('No hay vuelos disponibles en este momento.');
          }
        }
      } else {
        console.error('Error fetching flights:', response.status);
        alert('Error al obtener los vuelos');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error de conexión al obtener los vuelos');
    } finally {
      setLoadingFlights(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />

      {/* Hero Section with Advertising */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Descubre el Mundo
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Vuela a más de 200 destinos con las mejores tarifas
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold">
                🎉 Ofertas especiales desde $99
              </div>
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                ✨ Vuelos directos disponibles
              </div>
            </div>
          </div>
        </div>
        {/* Decorative airplane */}
        <div className="absolute right-10 top-10 text-white text-6xl opacity-20 hidden lg:block">
          ✈️
        </div>
      </section>

      {/* Flight Search Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Buscar Vuelos
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type Selection */}
            <div className="flex flex-wrap gap-4 justify-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={searchData.tripType === 'roundtrip'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600"
                />
                <span className="text-gray-700">Ida y vuelta</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={searchData.tripType === 'oneway'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600"
                />
                <span className="text-gray-700">Solo ida</span>
              </label>
            </div>

            {/* Flight Search Fields */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              searchData.tripType === 'roundtrip' 
                ? 'lg:grid-cols-5' 
                : 'lg:grid-cols-4 lg:max-w-4xl lg:mx-auto'
            }`}>
              {/* Origin */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origen
                </label>
                <select
                  name="origin"
                  value={searchData.origin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona origen</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre_ciudad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destino
                </label>
                <select
                  name="destination"
                  value={searchData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona destino</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre_ciudad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Date */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de ida
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchData.departureDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Return Date */}
              {searchData.tripType === 'roundtrip' && (
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de vuelta
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={searchData.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Passengers */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasajeros
                </label>
                <select
                  name="passengers"
                  value={searchData.passengers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Pasajero' : 'Pasajeros'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                🔍 Buscar Vuelos
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Destinos Populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Depuración: mostrar en consola las ciudades disponibles */}
          {console.log("Ciudades disponibles:", ciudades.map(c => c.nombre_ciudad))}
          {ciudades
            .filter(ciudad => {
              const nombre = ciudad.nombre_ciudad.trim().toLowerCase();
              const principales = ["miami", "new york", "madrid", "londres"];
              // Permitir variantes como 'NuevaYork', 'New York', etc.
              if (nombre === "new york" || nombre === "newyork" || nombre === "nueva york" || nombre === "nuevayork") return true;
              return principales.includes(nombre);
            })
            .map((ciudad, index) => (
              <div key={ciudad.id_ciudad} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-4xl overflow-hidden relative">
                  {/* Imagen desde el backend con fallback a emoji */}
                  {ciudad.nombre_ciudad.toLowerCase() === "miami" && (
                    <>
                      <img 
                        src="http://localhost:3001/uploads/images/city/miami.jpg" 
                        alt="Miami" 
                        className="h-full w-full object-cover absolute inset-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span role="img" aria-label="Miami" className="relative z-10"></span>
                    </>
                  )}
                  {ciudad.nombre_ciudad.toLowerCase() === "new york" && (
                    <img 
                      src="http://localhost:3001/uploads/images/city/newyork.jpg" 
                      alt="New York" 
                      className="h-full w-full object-cover"
                    />
                  )}
                  {ciudad.nombre_ciudad.toLowerCase() === "madrid" && (
                    <>
                      <img 
                        src="http://localhost:3001/uploads/images/city/madrid.JPG" 
                        alt="Madrid" 
                        className="h-full w-full object-cover absolute inset-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span role="img" aria-label="Madrid" className="relative z-10"></span>
                    </>
                  )}
                  {ciudad.nombre_ciudad.toLowerCase() === "londres" && (
                    <>
                      <img 
                        src="http://localhost:3001/uploads/images/city/londres.jpg" 
                        alt="Londres" 
                        className="h-full w-full object-cover absolute inset-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span role="img" aria-label="Londres" className="relative z-10"></span>
                    </>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{ciudad.nombre_ciudad}</h3>
                  <p className="text-gray-600">{ciudad.pais || ''}</p>
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams({ destination: ciudad.id_ciudad, ciudadNombre: ciudad.nombre_ciudad });
                      router.push(`/flights?${params.toString()}`);
                    }}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Vuelos
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ofertas Especiales
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold mb-4">🌞 Ofertas de Verano</h3>
                <p className="text-lg mb-4">Descuentos de hasta 40% en vuelos a destinos de playa</p>
                <button className="bg-white text-orange-500 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    router.push('/flights?descuento=1');
                  }}>
                  Ver Ofertas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flights Results Section */}
      {mounted && flights.length > 0 && (
        <section id="flights-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ✈️ Vuelos Disponibles
          </h2>
          
          {loadingFlights ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando vuelos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flights.map((flight) => (
                <div key={flight.ccv} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Vuelo #{flight.ccv}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        flight.estado === 1 ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                      }`}>
                        {flight.estado === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          flight.ruta?.es_nacional ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {flight.ruta?.es_nacional ? '🇵🇪 Nacional' : '🌎 Internacional'}
                        </span>
                        <span className="text-sm text-gray-500">Ruta: {flight.ruta?.codigo_ruta}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">🛫 Origen:</span>
                        <span>{flight.ruta?.origen?.nombre_ciudad || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">🛬 Destino:</span>
                        <span>{flight.ruta?.destino?.nombre_ciudad || 'N/A'}</span>
                      </div>
                      
                      {flight.fecha_vuelo && (
                        <div className="flex items-center text-gray-700">
                          <span className="font-semibold mr-2">📅 Fecha:</span>
                          <span>{new Date(flight.fecha_vuelo).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      
                      {flight.hora_salida_vuelo && (
                        <div className="border-b border-gray-200 pb-3 mb-3">
                          <div className="flex items-center text-gray-700 mb-2">
                            <span className="font-semibold mr-2">🕐 Salida:</span>
                            <span>{new Date(flight.hora_salida_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
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
                      
                      {flight.hora_llegada_vuelo && (
                        <div className="border-b border-gray-200 pb-3 mb-3">
                          <div className="flex items-center text-gray-700 mb-2">
                            <span className="font-semibold mr-2">🕐 Llegada:</span>
                            <span>{new Date(flight.hora_llegada_vuelo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {flight.timezone_info?.llegada && (
                            <div className="ml-6 bg-purple-50 p-2 rounded">
                              <div className="text-sm font-semibold text-purple-700">
                                📍 {flight.timezone_info.llegada.ciudad}
                              </div>
                              <div className="text-sm text-purple-600">
                                🕐 {flight.timezone_info.llegada.hora}
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
      )}

      <Footer />
    </div>
  );
}
