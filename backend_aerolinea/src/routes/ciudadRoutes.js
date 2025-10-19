import { Router } from 'express'
import { CiudadController } from '../controllers/ciudadController.js'

export const ciudadRoutes = Router()

// Ruta pública para obtener todas las ciudades
ciudadRoutes.get('/', CiudadController.getAll)
