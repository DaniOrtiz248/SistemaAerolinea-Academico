// API service for admin management
const API_BASE_URL = 'http://localhost:3001/api/v1';

class AdminService {
  // Get all admins (users with id_rol = 2)
  async getAdmins() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter only admins (id_rol = 2) from the response
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (data.usuario && Array.isArray(data.usuario)) {
        users = data.usuario;
      } else {
        console.log('Unexpected response format:', data);
        return [];
      }
      
      // Filter only admins (id_rol = 2)
      const admins = users.filter(user => user.id_rol === 2);
      
      console.log('All users:', users);
      console.log('Filtered admins:', admins);
      
      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Error al obtener la lista de administradores');
    }
  }

  // Create a new admin
  async createAdmin(adminData) {
    try {
      const userData = {
        descripcion_usuario: adminData.usuario,
        correo_electronico: adminData.correo_electronico,
        contrasena: adminData.contrasena,
        id_rol: 2
      };

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el administrador');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  // Update an existing admin
  async updateAdmin(adminId, adminData) {
    try {
      const userData = {
        descripcion_usuario: adminData.usuario,
        correo_electronico: adminData.correo_electronico,
        id_rol: 2
      };

      if (adminData.contrasena && adminData.contrasena.trim()) {
        userData.contrasena = adminData.contrasena;
      }

      const response = await fetch(`${API_BASE_URL}/users/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response from server:', errorData);
        
        let errorMessage = 'Error al actualizar el administrador';
        
        if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (Array.isArray(errorData.error)) {
            errorMessage = errorData.error.map(err => {
              if (typeof err === 'object' && err.message) {
                return err.message;
              }
              return String(err);
            }).join(', ');
          } else if (typeof errorData.error === 'object') {
            errorMessage = JSON.stringify(errorData.error);
          }
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(err => err.message || String(err)).join(', ');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  // Delete an admin
  async deleteAdmin(adminId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response from server:', errorData);
        
        let errorMessage = 'Error al eliminar el administrador';
        
        if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (Array.isArray(errorData.error)) {
            errorMessage = errorData.error.map(err => {
              if (typeof err === 'object' && err.message) {
                return err.message;
              }
              return String(err);
            }).join(', ');
          }
        }
        
        throw new Error(errorMessage);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  // Get a specific admin by ID
  async getAdminById(adminId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${adminId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw new Error('Error al obtener los datos del administrador');
    }
  }
}

const adminService = new AdminService();
export default adminService;
export { AdminService };