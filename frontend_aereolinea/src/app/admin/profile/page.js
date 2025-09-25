'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import EditProfile from '../../components/EditProfile';

export default function AdminProfile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
        
        // Solo permitir acceso a administradores (id_rol === 2)
        if (parsedUser.id_rol !== 2) {
          router.push('/login');
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

  const handleSaveProfile = async (profileData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`http://localhost:3001/api/v1/users/profile/${userData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          usuarioPerfilData: profileData
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar el estado local con los nuevos datos
        setUserProfile(result.data || userProfile);
        setIsEditing(false);
        
        // Opcional: mostrar mensaje de éxito
        setTimeout(() => {
          // Recargar datos del perfil
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.message || 'Error al actualizar');
      }
    } catch (error) {
      throw error; // Re-lanzar para que EditProfile maneje el error
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil de Administrador</h1>
              <p className="text-gray-600 mt-2">
                {isEditing ? 'Edita tu información personal' : 'Información de tu perfil personal'}
              </p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <EditProfile
              userProfile={userProfile}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              showMessage={true}
            />
          ) : (
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

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <p className="text-gray-900 font-medium">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                      Administrador
                    </span>
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
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}