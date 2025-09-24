import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const userRoutes = Router()

userRoutes.post('/register', UserController.create)
userRoutes.post('/login', UserController.login)

userRoutes.use(auth())
userRoutes.post('/crear-admin', UserController.createAdmin) // Endpoint temporal para crear un admin
userRoutes.get('/', UserController.getAll)
userRoutes.put('/:id', UserController.update)
userRoutes.delete('/:id', UserController.delete)
