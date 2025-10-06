import { UserService } from '../services/userService.js'
import { validateUser, validatePartialUser } from '../schema/userSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'

export class UserController {
  static async getAll (req, res) {
    try {
      const users = await UserService.listUsers()
      res.json(users)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener usuarios' })
    }
  }

  // Metodo para crear/registrar un usuario Cliente
  static async create (req, res) {
    // TODO: Crear la seccion de inicio de sesion cuando se registra el usuairo
    const validation = validateUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }

    try {
      req.body.usuario.id_rol = 3 // Forzar rol de cliente
      const created = await UserService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      if (err instanceof ValidationError) {
        const formatted = formatErrors(err)
        return res.status(formatted.status).json(formatted.error)
      }

      res.status(500).json({ error: 'Error al crear usuario' })
    }
  }

  // Metodo para crear un usuario Admin
  static async createAdmin (req, res) {
    try {
      // Normalizar: aceptar tanto { usuario: {...} } como los campos en root
      const payload = req.body && req.body.usuario ? req.body : { usuario: req.body }

      const validation = validatePartialUser(payload)
      console.log('Validation result:', payload)

      if (!validation.success) {
        return res.status(400).json({ error: validation.error.issues })
      }

      payload.usuario.id_rol = 2 // Forzar rol de admin
      const created = await UserService.createAdmin(payload)
      return res.status(201).json(created)
    } catch (err) {
      console.log(err)
      if (err instanceof ValidationError) {
        const formatted = formatErrors(err)
        return res.status(formatted.status).json(formatted.error)
      }
      return res.status(500).json({ error: 'Error al crear usuario Administrador' })
    }
  }

  static async update (req, res) {
    const validation = validatePartialUser(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error })
    }

    try {
      const id = req.params.id
      const updated = await UserService.update({ id, userData: req.body })
      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al actualizar usuario' })
    }
  }

  static async delete (req, res) {
    try {
      const id = req.params.id
      await UserService.delete({ id })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al eliminar usuario' })
    }
  }

  static async getUserProfile (req, res) {
    try {
      const { id_usuario } = req.params
      console.log('Getting profile for user:', id_usuario)
      
      const result = await UserService.getUserProfile({ id_usuario: parseInt(id_usuario) })
      console.log('User profile result:', result)
      
      // Si no tiene perfil y es administrador (rol = 2), crearlo automáticamente
      if (!result.usuarioPerfil && result.usuario.id_rol === 2) {
        console.log('Creating automatic profile for admin user:', id_usuario)
        
        const defaultProfile = {
          id_usuario: parseInt(id_usuario),
          dni_usuario: '',
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          fecha_nacimiento: null,
          pais_nacimiento: '',
          estado_nacimiento: '',
          ciudad_nacimiento: '',
          direccion_facturacion: '',
          id_genero_usuario: null
        }
        
        try {
          const createdProfile = await UserService.createAdminProfile({ 
            id_usuario: parseInt(id_usuario), 
            usuarioPerfilData: defaultProfile 
          })
          
          result.usuarioPerfil = createdProfile
          console.log('Profile created successfully:', createdProfile)
        } catch (profileError) {
          console.error('Error creating admin profile:', profileError)
          // Continuar sin perfil en lugar de fallar completamente
        }
      }
      
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      console.error('Error getting user profile:', error)
      res.status(500).json({ success: false, error: 'Error al obtener el perfil del usuario', details: error.message })
    }
  }

  static async updateProfile (req, res) {
    try {
      const { id_usuario } = req.params
      const { usuarioData, usuarioPerfilData } = req.body
      
      // Verificar si el usuario existe
      const userProfile = await UserService.getUserProfile({ id_usuario })
      
      if (!userProfile.usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      
      // Si no tiene perfil y es administrador (rol = 2), crearlo primero
      if (!userProfile.usuarioPerfil && userProfile.usuario.id_rol === 2) {
        const profileData = {
          id_usuario: parseInt(id_usuario),
          ...usuarioPerfilData
        }
        
        const createdProfile = await UserService.createAdminProfile({ 
          id_usuario: parseInt(id_usuario), 
          usuarioPerfilData: profileData 
        })
        
        return res.json({ 
          data: { 
            usuario: userProfile.usuario, 
            usuarioPerfil: createdProfile 
          } 
        })
      }
      
      // Si ya tiene perfil, actualizarlo
      const result = await UserService.updateProfile({ 
        id_usuario, 
        usuarioData, 
        usuarioPerfilData 
      })
      
      res.json({ data: result })
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error instanceof ValidationError) {
        return res.status(400).json(formatErrors(error))
      }
      res.status(500).json({ error: 'Error al actualizar el perfil' })
    }
  }
}
