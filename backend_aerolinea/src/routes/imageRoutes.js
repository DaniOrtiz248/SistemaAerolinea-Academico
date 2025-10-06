import { Router } from 'express'
import { ImageProfileController } from '../controllers/imageProfileController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { multerConfig } from '../middleware/multerConfig.js'
console.log('Cargando rutas de imagen de perfil...')
const upload = multerConfig({ uploadPath: 'uploads/images/profile' })

export const imageRoutes = Router()

// imageRoutes.get('/images/flight/:id', ImageProfileController.getById)

imageRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
imageRoutes.post('/create', upload.single('imagen'), ImageProfileController.create)
imageRoutes.get('/images/profile/:id', ImageProfileController.getById)
// imageRoutes.get('/:id', ImageProfileController.getById)
// imageRoutes.delete('/:id', ImageProfileController.delete)
