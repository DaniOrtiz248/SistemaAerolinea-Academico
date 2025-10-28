'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Cargar vuelos y rutas del backend
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener vuelos
        const flightsResponse = await fetch('http://localhost:3001/api/v1/flights');
        if (flightsResponse.ok) {
          const flightsResult = await flightsResponse.json();
          console.log('Vuelos obtenidos:', flightsResult);
          if (flightsResult.success && flightsResult.data) {
            const flightsWithSeats = flightsResult.data.map(flight => ({
              ...flight,
              available_seats: 100,
              total_seats: 180
            }));
            setFlights(flightsWithSeats);
          }
        }
        
        // Obtener rutas
        const resRoutes = await fetch('http://localhost:3001/api/v1/routes', { 
          credentials: 'include' 
        });
        
        if (!resRoutes.ok) {
          console.error('Error al obtener rutas:', resRoutes.status, resRoutes.statusText);
          setRoutes([]);
          return;
        }
        
        const dataRoutes = await resRoutes.json();
        console.log('Rutas obtenidas:', dataRoutes);
        
        if (Array.isArray(dataRoutes)) {
          setRoutes(dataRoutes);
          console.log('Rutas cargadas:', dataRoutes.length);
        } else if (dataRoutes.data && Array.isArray(dataRoutes.data)) {
          setRoutes(dataRoutes.data);
          console.log('Rutas cargadas:', dataRoutes.data.length);
        } else {
          console.warn('Formato de respuesta inesperado:', dataRoutes);
          setRoutes([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error al cargar los datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.ccv?.toString().includes(searchTerm.toLowerCase()) ||
      flight.ruta?.codigo_ruta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.ruta?.origen?.nombre_ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.ruta?.destino?.nombre_ciudad?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Mapear estado numérico a string para el filtro
    let flightStatus = 'active';
    if (flight.estado === 0) flightStatus = 'cancelled';
    else if (flight.available_seats === 0) flightStatus = 'sold_out';
    
    const matchesFilter = filterStatus === 'all' || flightStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (flight) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      sold_out: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Agotado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      delayed: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Retrasado' }
    };
    
    // Determinar el estado basado en los datos del vuelo
    let status = 'active';
    if (flight.estado === 0) status = 'cancelled';
    //else if (flight.available_seats === 0) status = 'sold_out';
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setShowModal(true);
  };

  const handleDelete = async (flightId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vuelo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/v1/flights/${flightId}`, {
        method: 'DELETE',
        credentials: 'include' // Para enviar cookies de autenticación
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Vuelo eliminado exitosamente');
        
        // Actualizar la lista de vuelos
        setFlights(flights.filter(f => f.ccv !== flightId));
      } else {
        const error = await response.json();
        console.error('Error deleting flight:', error);
        
        let errorMessage = 'Error al eliminar el vuelo';
        if (error.details) {
          errorMessage = error.details;
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error de conexión al intentar eliminar el vuelo: ' + error.message);
    }
  };

  const FlightModal = () => {
    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Obtener fecha y hora actual en formato para datetime-local
    const now = new Date();
    const currentDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    const [formData, setFormData] = useState(editingFlight || {
      ruta_relacionada: '',
      fecha_vuelo: '',
      hora_salida_vuelo: '',
      hora_llegada_vuelo: '',
      porcentaje_promocion: 0,
      estado: 1
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        if (editingFlight) {
          // Actualizar vuelo existente (implementar después)
          alert('Funcionalidad de actualización en desarrollo');
        } else {
          // Crear nuevo vuelo
          // Convertir formatos de fecha/hora al formato esperado por el backend
          const formatDateTime = (dateTimeStr) => {
            // Convierte "2024-10-28T14:30" a "2024-10-28 14:30:00"
            const date = new Date(dateTimeStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = '00';
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          const flightData = {
            ruta_relacionada: parseInt(formData.ruta_relacionada),
            fecha_vuelo: formData.fecha_vuelo, // Ya está en formato YYYY-MM-DD
            hora_salida_vuelo: formatDateTime(formData.hora_salida_vuelo),
            hora_llegada_vuelo: formatDateTime(formData.hora_llegada_vuelo),
            estado: parseInt(formData.estado),
            porcentaje_promocion: parseFloat(formData.porcentaje_promocion) || 0
          };

          console.log('Datos a enviar:', flightData);

          const response = await fetch('http://localhost:3001/api/v1/flights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Para enviar cookies de autenticación
            body: JSON.stringify(flightData)
          });

          if (response.ok) {
            const result = await response.json();
            alert('Vuelo creado exitosamente');
            
            // Recargar vuelos
            const flightsResponse = await fetch('http://localhost:3001/api/v1/flights');
            if (flightsResponse.ok) {
              const flightsResult = await flightsResponse.json();
              if (flightsResult.success && flightsResult.data) {
                const flightsWithSeats = flightsResult.data.map(flight => ({
                  ...flight,
                  available_seats: 100,
                  total_seats: 180
                }));
                setFlights(flightsWithSeats);
              } else if (Array.isArray(flightsResult)) {
                const flightsWithSeats = flightsResult.map(flight => ({
                  ...flight,
                  available_seats: 100,
                  total_seats: 180
                }));
                setFlights(flightsWithSeats);
              }
            }
            
            setShowModal(false);
            setEditingFlight(null);
          } else {
            const error = await response.json();
            console.error('Error creating flight:', error);
            
            // Mostrar detalles del error si están disponibles
            let errorMessage = 'Error al crear el vuelo';
            if (error.details && Array.isArray(error.details)) {
              const detailedErrors = error.details.map(d => `- ${d.path?.join('.')}: ${d.message}`).join('\n');
              errorMessage = `Error de validación:\n${detailedErrors}`;
            } else if (error.error) {
              errorMessage = error.error;
            }
            
            alert(errorMessage);
          }
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Error de conexión al crear el vuelo: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingFlight ? 'Editar Vuelo' : 'Nuevo Vuelo'}
            </h3>
            
            {routes.length === 0 && (
              <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>No hay rutas disponibles.</strong> Debes crear al menos una ruta antes de crear un vuelo.
                      Ve a la sección de <strong>Rutas</strong> primero.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Ruta *
                  </label>
                  <select
                    value={formData.ruta_relacionada}
                    onChange={(e) => setFormData({...formData, ruta_relacionada: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={routes.length === 0}
                  >
                    <option value="">
                      {routes.length === 0 ? 'No hay rutas disponibles' : 'Selecciona una ruta'}
                    </option>
                    {routes.map((route) => (
                      <option key={route.id_ruta} value={route.id_ruta}>
                        {route.codigo_ruta} - {route.origen?.nombre_ciudad || route.origen?.id_ciudad || 'N/A'} → {route.destino?.nombre_ciudad || route.destino?.id_ciudad || 'N/A'}
                        {' '}({route.es_nacional ? 'Nacional' : 'Internacional'})
                      </option>
                    ))}
                  </select>
                  {routes.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">
                      ⚠️ Debes crear al menos una ruta antes de crear un vuelo
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Fecha de Vuelo *
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_vuelo}
                    min={today}
                    onChange={(e) => setFormData({...formData, fecha_vuelo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">No se pueden programar vuelos en fechas pasadas</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Hora de Salida *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.hora_salida_vuelo}
                    min={currentDateTime}
                    onChange={(e) => {
                      setFormData({...formData, hora_salida_vuelo: e.target.value});
                      // Si hay hora de llegada y es menor que la de salida, limpiarla
                      if (formData.hora_llegada_vuelo && e.target.value >= formData.hora_llegada_vuelo) {
                        setFormData({...formData, hora_salida_vuelo: e.target.value, hora_llegada_vuelo: ''});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Debe ser posterior a la hora actual</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Hora de Llegada *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.hora_llegada_vuelo}
                    min={formData.hora_salida_vuelo || currentDateTime}
                    onChange={(e) => setFormData({...formData, hora_llegada_vuelo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={!formData.hora_salida_vuelo}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {!formData.hora_salida_vuelo 
                      ? 'Primero selecciona la hora de salida' 
                      : 'Debe ser posterior a la hora de salida'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Porcentaje de Promoción (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.porcentaje_promocion}
                    onChange={(e) => setFormData({...formData, porcentaje_promocion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="0 = Sin promoción"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingFlight(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={routes.length === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    routes.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {editingFlight ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando vuelos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vuelos</h1>
          <p className="text-gray-600 mt-2">Administra todos los vuelos de Aero Penguin</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por código de vuelo, ruta, origen o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="sold_out">Agotados</option>
                <option value="cancelled">Cancelados</option>
                <option value="delayed">Retrasados</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Nuevo Vuelo
            </button>
          </div>
        </div>

        {/* Tabla de vuelos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vuelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Llegada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asientos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFlights.map((flight) => {
                  const departure = formatDateTime(flight.hora_salida_vuelo);
                  const arrival = formatDateTime(flight.hora_llegada_vuelo);
                  
                  // Calcular precios con descuento si hay promoción
                  const precioClase1 = flight.porcentaje_promocion 
                    ? (flight.ruta?.precio_primer_clase * (1 - flight.porcentaje_promocion / 100)).toFixed(2)
                    : flight.ruta?.precio_primer_clase;
                  
                  const precioClase2 = flight.porcentaje_promocion 
                    ? (flight.ruta?.precio_segunda_clase * (1 - flight.porcentaje_promocion / 100)).toFixed(2)
                    : flight.ruta?.precio_segunda_clase;
                  
                  return (
                    <tr key={flight.ccv} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{flight.ccv}</div>
                        {flight.porcentaje_promocion > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            -{flight.porcentaje_promocion}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{flight.ruta?.codigo_ruta || 'N/A'}</div>
                        <div className="text-sm text-gray-900">
                          {flight.ruta?.origen?.nombre_ciudad || 'N/A'} → {flight.ruta?.destino?.nombre_ciudad || 'N/A'}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          flight.ruta?.es_nacional ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {flight.ruta?.es_nacional ? 'Nacional' : 'Internacional'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{departure.date}</div>
                        <div className="text-sm text-gray-500">{departure.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{arrival.date}</div>
                        <div className="text-sm text-gray-500">{arrival.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">1ª: ${precioClase1}</div>
                        <div className="text-sm font-medium text-green-600">2ª: ${precioClase2}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {flight.available_seats || 0}/{flight.total_seats}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${((flight.available_seats || 0) / flight.total_seats) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(flight)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(flight)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(flight.ccv)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredFlights.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron vuelos con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && <FlightModal />}
    </AdminLayout>
  );
}