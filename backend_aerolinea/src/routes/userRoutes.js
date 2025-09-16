import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const userRoutes = Router()

userRoutes.get('/', UserController.getAll)
userRoutes.post('/register', UserController.create)
userRoutes.post('/login', UserController.login)
userRoutes.put('/:id', UserController.update)
userRoutes.delete('/:id', UserController.delete)
