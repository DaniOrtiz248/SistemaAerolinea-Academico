import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { loginController } from '../controllers/loginController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { rootMiddleware } from '../middleware/authMiddleware.js'


export const userRoutes = Router()

userRoutes.post('/register', UserController.create)
userRoutes.post('/login', loginController.login)
userRoutes.post('/request-reset', loginController.requestPasswordReset)
userRoutes.post('/reset-password', loginController.resetPassword)

userRoutes.use(authMiddleware) // Middleware para proteger las rutas siguientes
userRoutes.post('/crear-admin', rootMiddleware, UserController.createAdmin) // Endpoint para crear un admin
userRoutes.get('/', UserController.getAll)
userRoutes.put('/:id', UserController.update)
userRoutes.delete('/:id', UserController.delete)

userRoutes.get('/profile/:id_usuario', UserController.getUserProfile)
userRoutes.put('/profile/:id_usuario', UserController.updateProfile)
