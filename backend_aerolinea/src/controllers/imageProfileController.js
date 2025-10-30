// import { ImageProfileService } from '../services/imageProfileService.js'
import { UserService } from '../services/userService.js'
import { convertToJPG } from '../utils/imageProccesor.js'
import fs from 'fs'
import path from 'path'

export class ImageProfileController {
  static async create (req, res) {
    try {
      console.log('=== INICIO SUBIDA DE IMAGEN ===')
      console.log('Usuario autenticado:', req.user)
      console.log('Archivo recibido:', req.file)

      if (!req.file) {
        console.error('No se recibió archivo')
        return res.status(400).json({ error: 'No se ha subido ningún archivo' })
      }

      const idUser = req.user.id
      console.log('ID de usuario:', idUser)

      const filename = idUser + '.jpeg'
      const newPath = `${req.file.destination}/${filename}`

      console.log('Ruta original:', req.file.path)
      console.log('Nueva ruta:', newPath)

      // Convertir imagen a JPEG
      convertToJPG(req.file.path, newPath)

      // Actualizar la base de datos con la ruta de la imagen (solo si el perfil existe)
      console.log('Verificando si el perfil existe...')
      try {
        const userProfile = await UserService.getUserProfile({ id_usuario: idUser })

        if (userProfile.usuarioPerfil) {
          console.log('Perfil existe, actualizando base de datos...')
          await UserService.updateProfile({
            id_usuario: idUser,
            usuarioPerfilData: {
              imagen_usuario: `uploads/images/profile/${filename}`
            }
          })
          console.log('Base de datos actualizada correctamente')
        } else {
          console.log('El usuario no tiene perfil aún, la imagen se guardó pero no se actualizó la BD')
          console.log('La imagen estará disponible cuando el usuario complete su perfil')
        }
      } catch (dbError) {
        console.warn('Error al actualizar BD, pero la imagen se guardó correctamente:', dbError.message)
        // No lanzar error aquí, la imagen ya está guardada en el sistema de archivos
      }

      console.log('=== IMAGEN SUBIDA EXITOSAMENTE ===')
      res.status(201).json({
        message: 'Imagen creada exitosamente',
        imagePath: `uploads/images/profile/${filename}`
      })
    } catch (err) {
      console.error('=== ERROR AL SUBIR IMAGEN ===')
      console.error('Error completo:', err)
      console.error('Stack trace:', err.stack)
      res.status(500).json({ error: 'Error al crear imagen', details: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params
      let imagePath = path.join('uploads/images/profile', `${id}`)
      imagePath = path.resolve(imagePath)

      console.log('Enviando imagen:', imagePath)
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Imagen no encontrada' })
      }
      res.sendFile(imagePath)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener imagen' })
    }
  }
}
