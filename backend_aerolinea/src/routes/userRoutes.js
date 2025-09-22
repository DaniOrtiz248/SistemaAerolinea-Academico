import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { loginController } from '../controllers/loginController.js'

export const userRoutes = Router()

userRoutes.post('/register', UserController.create)
userRoutes.post('/login', loginController.login)
userRoutes.post('/login/reset', loginController.resetPassword)

userRoutes.post('/crear-admin', UserController.createAdmin) // Endpoint temporal para crear un admin
userRoutes.get('/', UserController.getAll)
userRoutes.put('/:id', UserController.update)
userRoutes.delete('/:id', UserController.delete)
