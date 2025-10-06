// import { ImageProfileService } from '../services/imageProfileService.js'
import { UserService } from '../services/userService.js'
import { convertToJPG } from '../utils/imageProccesor.js'
import fs from 'fs'
import path from 'path'

export class ImageProfileController {
  static async create (req, res) {
    try {
      console.log('Archivo recibido:', req.file)

      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' })
      }

      const idUser = req.user.id
      // console.log('Este es el file ', req)
      const filename = idUser + '.jpeg'
      const newPath = `${req.file.destination}/${filename}`

      convertToJPG(req.file.path, newPath)

      await UserService.updateProfile({ usuarioPerfilData: { imagen_usuario: `uploads/images/profile/${filename}` }, id_usuario: idUser })

      res.status(201).json({ message: 'Imagen creada exitosamente' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al crear imagen' })
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
