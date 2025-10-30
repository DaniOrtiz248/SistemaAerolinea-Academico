import { Router } from 'express'
import { ImageProfileController } from '../controllers/imageProfileController.js'
import { ImageCiudadController } from '../controllers/imageCiudadController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { multerConfig } from '../middleware/multerConfig.js'
const upload = multerConfig({ uploadPath: 'uploads/images/profile' })
const uploadCity = multerConfig({ uploadPath: 'uploads/images/city' })

export const imageRoutes = Router()

// imageRoutes.get('/images/flight/:id', ImageProfileController.getById)

imageRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
// Rutas para imágenes de perfil
imageRoutes.post('/create', upload.single('imagen'), ImageProfileController.create)
imageRoutes.get('/images/profile/:id', ImageProfileController.getById)
// Rutas para imágenes de ciudad
imageRoutes.post('/create/ciudad/:id', uploadCity.single('imagen'), ImageCiudadController.create)
imageRoutes.get('/images/ciudad/:id', ImageCiudadController.getById)
