'use client';
import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo - en un caso real, estos vendrían del backend
  const exampleFlights = useMemo(() => [
    {
      id: 1,
      flight_number: 'AP001',
      origin: 'Madrid',
      destination: 'Barcelona',
      departure_time: '2025-01-15T10:30:00',
      arrival_time: '2025-01-15T11:45:00',
      price: 150.00,
      available_seats: 45,
      total_seats: 180,
      status: 'active',
      aircraft: 'Boeing 737'
    },
    {
      id: 2,
      flight_number: 'AP002',
      origin: 'Barcelona',
      destination: 'Sevilla',
      departure_time: '2025-01-15T14:20:00',
      arrival_time: '2025-01-15T15:30:00',
      price: 89.99,
      available_seats: 0,
      total_seats: 150,
      status: 'sold_out',
      aircraft: 'Airbus A320'
    },
    {
      id: 3,
      flight_number: 'AP003',
      origin: 'Sevilla',
      destination: 'Valencia',
      departure_time: '2025-01-16T09:15:00',
      arrival_time: '2025-01-16T10:45:00',
      price: 120.50,
      available_seats: 78,
      total_seats: 180,
      status: 'active',
      aircraft: 'Boeing 737'
    },
    {
      id: 4,
      flight_number: 'AP004',
      origin: 'Valencia',
      destination: 'Madrid',
      departure_time: '2025-01-16T16:00:00',
      arrival_time: '2025-01-16T17:15:00',
      price: 110.00,
      available_seats: 25,
      total_seats: 150,
      status: 'cancelled',
      aircraft: 'Airbus A320'
    }
  ], []);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setFlights(exampleFlights);
      setLoading(false);
    }, 1000);
  }, [exampleFlights]);

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || flight.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      sold_out: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Agotado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      delayed: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Retrasado' }
    };
    
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

  const handleDelete = (flightId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vuelo?')) {
      setFlights(flights.filter(f => f.id !== flightId));
    }
  };

  const FlightModal = () => {
    const [formData, setFormData] = useState(editingFlight || {
      flight_number: '',
      origin: '',
      destination: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      total_seats: '',
      aircraft: '',
      status: 'active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingFlight) {
        // Actualizar vuelo existente
        setFlights(flights.map(f => f.id === editingFlight.id ? { ...formData, id: editingFlight.id } : f));
      } else {
        // Crear nuevo vuelo
        const newFlight = {
          ...formData,
          id: Date.now(),
          available_seats: parseInt(formData.total_seats)
        };
        setFlights([...flights, newFlight]);
      }
      setShowModal(false);
      setEditingFlight(null);
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingFlight ? 'Editar Vuelo' : 'Nuevo Vuelo'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Vuelo
                  </label>
                  <input
                    type="text"
                    value={formData.flight_number}
                    onChange={(e) => setFormData({...formData, flight_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aeronave
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft}
                    onChange={(e) => setFormData({...formData, aircraft: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origen
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destino
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha/Hora Salida
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha/Hora Llegada
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.arrival_time}
                    onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asientos Totales
                  </label>
                  <input
                    type="number"
                    value={formData.total_seats}
                    onChange={(e) => setFormData({...formData, total_seats: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="delayed">Retrasado</option>
                  </select>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
                  placeholder="Buscar por número de vuelo, origen o destino..."
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
                  const departure = formatDateTime(flight.departure_time);
                  const arrival = formatDateTime(flight.arrival_time);
                  
                  return (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{flight.flight_number}</div>
                        <div className="text-sm text-gray-500">{flight.aircraft}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight.origin} → {flight.destination}</div>
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
                        <div className="text-sm font-medium text-gray-900">€{flight.price}</div>
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
                        {getStatusBadge(flight.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(flight)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(flight.id)}
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