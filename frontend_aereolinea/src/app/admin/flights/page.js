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
          
          let flightsData = [];
          if (flightsResult.success && flightsResult.data) {
            flightsData = flightsResult.data;
          } else if (Array.isArray(flightsResult)) {
            flightsData = flightsResult;
          }
          
          const flightsWithSeats = flightsData.map(flight => ({
            ...flight,
            available_seats: 100,
            total_seats: 180
          }));
          setFlights(flightsWithSeats);
          console.log('Vuelos cargados:', flightsWithSeats.length);
        } else {
          console.error('Error al obtener vuelos:', flightsResponse.status);
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
    if (flight.estado === 0) flightStatus = 'inactive';
    else if (flight.available_seats === 0) flightStatus = 'sold_out';
    
    const matchesFilter = filterStatus === 'all' || flightStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (flight) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      sold_out: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Agotado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactivo' },
      delayed: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Retrasado' }
    };
    
    // Determinar el estado basado en los datos del vuelo
    let status = 'active';
    if (flight.estado === 0) status = 'inactive';
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

    // Función para manejar el cambio de fecha de vuelo
    const handleFechaVueloChange = (newDate) => {
      setFormData({
        ...formData,
        fecha_vuelo: newDate,
        // Limpiar las horas si se cambia la fecha
        hora_salida_vuelo: '',
        hora_llegada_vuelo: ''
      });
    };

    // Función para obtener el mínimo datetime para hora de salida basado en la fecha de vuelo
    const getMinSalidaDateTime = () => {
      if (!formData.fecha_vuelo) return currentDateTime;
      
      // Si la fecha de vuelo es hoy, usar la hora actual como mínimo
      if (formData.fecha_vuelo === today) {
        return currentDateTime;
      }
      
      // Si es una fecha futura, permitir desde las 00:00 de ese día
      return `${formData.fecha_vuelo}T00:00`;
    };

    // Función para obtener el máximo datetime para hora de salida (final del día de vuelo)
    const getMaxSalidaDateTime = () => {
      if (!formData.fecha_vuelo) return undefined;
      return `${formData.fecha_vuelo}T23:59`;
    };

    // Función para obtener el mínimo datetime para hora de llegada
    const getMinLlegadaDateTime = () => {
      if (!formData.hora_salida_vuelo) return undefined;
      return formData.hora_salida_vuelo;
    };

    // Función para obtener el máximo datetime para hora de llegada (hasta el final del día siguiente al día de salida)
    const getMaxLlegadaDateTime = () => {
      if (!formData.hora_salida_vuelo) return undefined;
      const salidaDate = new Date(formData.hora_salida_vuelo);
      // Obtener solo la fecha (sin hora) y agregar 1 día
      const fechaSalida = salidaDate.toISOString().split('T')[0];
      const fechaMaxima = new Date(fechaSalida);
      fechaMaxima.setDate(fechaMaxima.getDate() + 1);
      return `${fechaMaxima.toISOString().split('T')[0]}T23:59`;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validación adicional para crear vuelo: hora de llegada al menos 1 hora mayor
      if (!editingFlight) {
        const salidaDate = new Date(formData.hora_salida_vuelo);
        const llegadaDate = new Date(formData.hora_llegada_vuelo);
        const diffMinutes = (llegadaDate - salidaDate) / (1000 * 60);
        
        if (diffMinutes < 15) {
          alert('⚠️ Error: La hora de llegada debe ser al menos 15 minutos mayor a la hora de salida.');
          return;
        }
      }
      
      try {
        if (editingFlight) {
          // Actualizar solo el porcentaje de promoción
          const updateData = {
            porcentaje_promocion: parseFloat(formData.porcentaje_promocion) || 0
          };

          console.log('Actualizando vuelo:', editingFlight.ccv, updateData);

          const response = await fetch(`http://localhost:3001/api/v1/flights/${editingFlight.ccv}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updateData)
          });

          if (response.ok) {
            const result = await response.json();
            alert('Descuento aplicado exitosamente');
            
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
            console.error('Error updating flight:', error);
            
            let errorMessage = 'Error al actualizar el vuelo';
            if (error.details && Array.isArray(error.details)) {
              const detailedErrors = error.details.map(d => `- ${d.path?.join('.')}: ${d.message}`).join('\n');
              errorMessage = `Error de validación:\n${detailedErrors}`;
            } else if (error.error) {
              errorMessage = error.error;
            }
            
            alert(errorMessage);
          }
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
              {editingFlight ? 'Aplicar Descuento al Vuelo' : 'Nuevo Vuelo'}
            </h3>
            
            {editingFlight && (
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Vuelo #{editingFlight.ccv}</strong><br/>
                      Ruta: {editingFlight.ruta?.codigo_ruta} - {editingFlight.ruta?.origen?.nombre_ciudad} → {editingFlight.ruta?.destino?.nombre_ciudad}<br/>
                      Descuento actual: <strong>{editingFlight.porcentaje_promocion}%</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!editingFlight && routes.length === 0 && (
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
              {editingFlight ? (
                // Modo edición: solo mostrar campo de descuento
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Porcentaje de Descuento (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.porcentaje_promocion}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Limitar el valor entre 0 y 100
                      if (value === "") value = "";
                      else {
                        value = Math.max(0, Math.min(100, Number(value)));
                      }
                      setFormData({...formData, porcentaje_promocion: value});
                    }}
                    onKeyDown={e => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ejemplo: 15 (para 15% de descuento)"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    💡 Ingresa 0 para eliminar el descuento. Máximo 100%.
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Vista previa de precios con descuento:</strong>
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700">
                        Primera clase: 
                        <span className="line-through text-gray-500 ml-2">
                          ${editingFlight.ruta?.precio_primer_clase}
                        </span>
                        <span className="text-blue-600 font-medium ml-2">
                          ${((editingFlight.ruta?.precio_primer_clase || 0) * (1 - (formData.porcentaje_promocion || 0) / 100)).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700">
                        Segunda clase: 
                        <span className="line-through text-gray-500 ml-2">
                          ${editingFlight.ruta?.precio_segunda_clase}
                        </span>
                        <span className="text-green-600 font-medium ml-2">
                          ${((editingFlight.ruta?.precio_segunda_clase || 0) * (1 - (formData.porcentaje_promocion || 0) / 100)).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Modo creación: mostrar todos los campos
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
                    onChange={(e) => handleFechaVueloChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Selecciona primero la fecha del vuelo para configurar las horas
                  </p>
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
                    Hora de Salida
                    {formData.ccv_ruta && routes.find(r => r.ccv === parseInt(formData.ccv_ruta))?.origen?.nombre_ciudad && (
                      <span className="ml-2 text-xs text-blue-600">
                        🌍 {routes.find(r => r.ccv === parseInt(formData.ccv_ruta))?.origen?.nombre_ciudad}
                      </span>
                    )}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.hora_salida_vuelo}
                    min={getMinSalidaDateTime()}
                    max={getMaxSalidaDateTime()}
                    onChange={(e) => {
                      const newSalida = e.target.value;
                      // Si hay hora de llegada y la nueva salida es mayor o igual, limpiar llegada
                      if (formData.hora_llegada_vuelo && newSalida >= formData.hora_llegada_vuelo) {
                        setFormData({
                          ...formData, 
                          hora_salida_vuelo: newSalida, 
                          hora_llegada_vuelo: ''
                        });
                      } else {
                        setFormData({...formData, hora_salida_vuelo: newSalida});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={!formData.fecha_vuelo}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {!formData.fecha_vuelo 
                      ? '⚠️ Primero selecciona la fecha de vuelo' 
                      : 'Debe estar dentro del día seleccionado'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Hora de Llegada
                    {formData.ccv_ruta && routes.find(r => r.ccv === parseInt(formData.ccv_ruta))?.destino?.nombre_ciudad && (
                      <span className="ml-2 text-xs text-purple-600">
                        🌍 {routes.find(r => r.ccv === parseInt(formData.ccv_ruta))?.destino?.nombre_ciudad}
                      </span>
                    )}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.hora_llegada_vuelo}
                    min={getMinLlegadaDateTime()}
                    max={getMaxLlegadaDateTime()}
                    onChange={(e) => {
                      const newLlegada = e.target.value;
                      const salidaDate = new Date(formData.hora_salida_vuelo);
                      const llegadaDate = new Date(newLlegada);
                      const diffMinutes = (llegadaDate - salidaDate) / (1000 * 60);

                      // Validar que sea al menos 15 minutos mayor
                      if (diffMinutes < 15) {
                        alert('⚠️ La hora de llegada debe ser al menos 15 minutos mayor a la hora de salida.');
                        return;
                      }
                      setFormData({...formData, hora_llegada_vuelo: newLlegada});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={!formData.hora_salida_vuelo}
                  />
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {!formData.hora_salida_vuelo 
                      ? ' Primero selecciona la hora de salida' 
                      : ' Debe ser al menos 15 minutos mayor a la hora de salida'}
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
                    onChange={(e) => {
                      let value = e.target.value;
                      // Limitar el valor entre 0 y 100
                      if (value === "") value = "";
                      else {
                        value = Math.max(0, Math.min(100, Number(value)));
                      }
                      setFormData({...formData, porcentaje_promocion: value});
                    }}
                    onKeyDown={e => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="0 = Sin promoción"
                  />
                </div>
              </div>
              )}
              
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
                  disabled={!editingFlight && routes.length === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    (!editingFlight && routes.length === 0)
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {editingFlight ? 'Aplicar Descuento' : 'Crear'}
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
                  className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 mr-4 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="sold_out">Agotados</option>
                <option value="cancelled">Cancelados</option>
                <option value="delayed">Retrasados</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Nuevo Vuelo
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
                        <div className="text-sm font-medium text-gray-900">{departure.time}</div>
                        {flight.timezone_info?.salida && (
                          <div className="mt-1 pt-1 border-t border-gray-200">
                            <div className="text-xs font-semibold text-blue-700">
                              {flight.ruta?.origen?.nombre_ciudad}
                            </div>
                            <div className="text-xs text-blue-600">
                              {flight.timezone_info.salida.hora}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{arrival.date}</div>
                        <div className="text-sm font-medium text-gray-900">{arrival.time}</div>
                        {flight.timezone_info?.llegada && (
                          <div className="mt-1 pt-1 border-t border-gray-200">
                            <div className="text-xs font-semibold text-purple-700">
                              {flight.ruta?.destino?.nombre_ciudad}
                            </div>
                            <div className="text-xs text-purple-600">
                              {flight.timezone_info.llegada.hora}
                            </div>
                          </div>
                        )}
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