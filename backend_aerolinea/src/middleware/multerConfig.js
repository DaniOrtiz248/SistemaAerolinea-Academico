import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configuración de Multer para almacenar archivos en el sistema de archivos
export function multerConfig ({ uploadPath = 'uploads/misc' } = {}) {
  const resolvedUploadPath = path.resolve(uploadPath)
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Crear el directorio si no existe
      fs.mkdirSync(resolvedUploadPath, { recursive: true })
      cb(null, resolvedUploadPath)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos de imagen
    console.log('esto es file', file)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'), false)
    }
  }

  const upload = multer({ storage, fileFilter })

  return upload
}
