import Ciudad from '../models/ciudad.js'
import { convertToJPG } from '../utils/imageProccesor.js'
import fs from 'fs'
import path from 'path'

export class ImageCiudadController {
  static async create (req, res) {
    try {
      console.log('=== INICIO SUBIDA IMAGEN CIUDAD ===')
      console.log('Archivo recibido:', req.file)

      if (!req.file) {
        console.error('No se recibió archivo')
        return res.status(400).json({ error: 'No se ha subido ningún archivo' })
      }

      const idCiudad = req.body.id_ciudad || req.body.id || req.params.id
      if (!idCiudad) {
        // Limpia el archivo temporal si existe
        try { fs.unlinkSync(req.file.path) } catch (e) { /* ignore */ }
        return res.status(400).json({ error: 'Se requiere el id de la ciudad (id_ciudad)' })
      }

      const filename = `${idCiudad}.jpeg`
      const newPath = `${req.file.destination}/${filename}`

      console.log('Ruta original:', req.file.path)
      console.log('Nueva ruta:', newPath)

      // Convertir imagen a JPEG (puede sobrescribir si ya existe)
      convertToJPG(req.file.path, newPath)

      // Intentar actualizar la base de datos con la ruta de la imagen
      try {
        const [updatedCount] = await Ciudad.update(
          { imagen_ciudad: `uploads/images/city/${filename}` },
          { where: { id_ciudad: idCiudad } }
        )

        if (updatedCount === 0) {
          console.warn('No se encontró ciudad con id:', idCiudad)
          return res.status(404).json({ message: 'Ciudad no encontrada. La imagen fue guardada localmente.' , imagePath: `uploads/images/city/${filename}`})
        }
      } catch (dbError) {
        console.warn('Error al actualizar BD:', dbError.message)
        // No lanzar error, informar que la imagen quedó almacenada
        return res.status(201).json({ message: 'Imagen guardada pero no se pudo actualizar la BD', imagePath: `uploads/images/city/${filename}`, details: dbError.message })
      }

      console.log('=== IMAGEN CIUDAD SUBIDA EXITOSAMENTE ===')
      return res.status(201).json({ message: 'Imagen de ciudad creada exitosamente', imagePath: `uploads/images/city/${filename}` })
    } catch (err) {
      console.error('Error al subir imagen de ciudad:', err)
      return res.status(500).json({ error: 'Error al crear imagen de ciudad', details: err.message })
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params
      let imagePath = path.join('uploads/images/city', `${id}`)
      imagePath = path.resolve(imagePath)

      console.log('Enviando imagen ciudad:', imagePath)
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Imagen no encontrada' })
      }
      res.sendFile(imagePath)
    } catch (err) {
      console.error('Error al obtener imagen de ciudad:', err)
      res.status(500).json({ error: 'Error al obtener imagen' })
    }
  }
}
