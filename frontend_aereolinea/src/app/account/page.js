'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MyAccount() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      // Verificar autenticación
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        
        // Solo permitir acceso a usuarios normales (id_rol === 3)
        if (parsedUser.id_rol !== 3) {
          // Redirigir según el rol del usuario
          if (parsedUser.id_rol === 1) {
            router.push('/root/dashboard');
          } else if (parsedUser.id_rol === 2) {
            router.push('/admin');
          } else {
            router.push('/');
          }
          return;
        }

        // Obtener perfil completo del backend
        const response = await fetch(`http://localhost:3001/api/v1/users/profile/${parsedUser.id_usuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          setUserProfile(result.data);
        } else {
          console.error('Error al obtener perfil');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
            <p className="text-gray-600 mt-2">Información de tu perfil personal</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información de Usuario */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Usuario
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuario?.descripcion_usuario || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuario?.correo_electronico || 'No especificado'}
                </p>
              </div>

              {/* Información de Perfil */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.dni_usuario || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primer Nombre
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.primer_nombre || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segundo Nombre
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.segundo_nombre || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primer Apellido
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.primer_apellido || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segundo Apellido
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.segundo_apellido || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.fecha_nacimiento ? 
                    userProfile.usuarioPerfil.fecha_nacimiento.split('T')[0].split('-').reverse().join('/') : 
                    'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Nacimiento
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.pais_nacimiento || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado/Provincia
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.estado_nacimiento || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.ciudad_nacimiento || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Facturación
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.direccion_facturacion || 'No especificado'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <p className="text-gray-900 font-medium">
                  {userProfile?.usuarioPerfil?.id_genero_usuario === 1 ? 'Masculino' :
                   userProfile?.usuarioPerfil?.id_genero_usuario === 2 ? 'Femenino' :
                   userProfile?.usuarioPerfil?.id_genero_usuario === 3 ? 'Otro' :
                   'No especificado'}
                </p>
              </div>
            </div>

            {/* Botón para editar */}
            <div className="flex justify-center pt-6 border-t border-gray-200">
              <Link
                href="/account/edit"
                className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Editar Información
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />        
    </div>
  );
}