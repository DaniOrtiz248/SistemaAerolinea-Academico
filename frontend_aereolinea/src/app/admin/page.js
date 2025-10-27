'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalFlights: 0,
    activeFlights: 0,
    totalUsers: 0,
    recentActivity: []
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Aquí podrías cargar estadísticas reales desde el backend
    // Por ahora uso datos de ejemplo
    setStats({
      totalFlights: 45,
      activeFlights: 23,
      totalUsers: 1250,
      recentActivity: [
        { id: 1, action: 'Nuevo vuelo creado', time: '2 minutos atrás', type: 'success' },
        { id: 2, action: 'Usuario registrado', time: '15 minutos atrás', type: 'info' },
        { id: 3, action: 'Vuelo cancelado', time: '1 hora atrás', type: 'warning' },
        { id: 4, action: 'Perfil actualizado', time: '2 horas atrás', type: 'info' }
      ]
    });
  }, []);

  const StatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-4xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getTypeColor = (type) => {
      switch (type) {
        case 'success': return 'text-green-600 bg-green-100';
        case 'warning': return 'text-yellow-600 bg-yellow-100';
        case 'error': return 'text-red-600 bg-red-100';
        default: return 'text-blue-600 bg-blue-100';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className={`w-2 h-2 rounded-full ${getTypeColor(activity.type).split(' ')[1]}`}></div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.descripcion_usuario}!
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de administración de Aero Penguin
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/flights"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <h3 className="font-semibold">Gestionar Vuelos</h3>
                  <p className="text-sm opacity-90">Ver y editar vuelos</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/routes"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">�️</span>
                <div>
                  <h3 className="font-semibold">Gestionar Rutas</h3>
                  <p className="text-sm opacity-90">Ver y editar rutas</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/profile"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">�</span>
                <div>
                  <h3 className="font-semibold">Mi Perfil</h3>
                  <p className="text-sm opacity-90">Editar información personal</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total de Vuelos"
              value={stats.totalFlights}
              icon="✈️"
              color="#3B82F6"
              description="En la base de datos"
            />
            <StatCard
              title="Vuelos Activos"
              value={stats.activeFlights}
              icon="🟢"
              color="#10B981"
              description="Disponibles para reserva"
            />
            <StatCard
              title="Usuarios Registrados"
              value={stats.totalUsers}
              icon="👥"
              color="#8B5CF6"
              description="Clientes totales"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
            <div className="space-y-2">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enlaces Útiles</h2>
            <div className="space-y-3">
              <Link
                href="/admin/flights"
                className="flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span>✈️</span>
                <span>Administrar Vuelos</span>
              </Link>
              <Link
                href="/admin/routes"
                className="flex items-center space-x-3 p-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <span>🛣️</span>
                <span>Administrar Rutas</span>
              </Link>
              <Link
                href="/admin/profile"
                className="flex items-center space-x-3 p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <span>👤</span>
                <span>Editar Mi Perfil</span>
              </Link>
              <div className="flex items-center space-x-3 p-3 text-gray-400 rounded-lg">
                <span>📊</span>
                <span>Reportes (Próximamente)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 text-gray-400 rounded-lg">
                <span>⚙️</span>
                <span>Configuración (Próximamente)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}