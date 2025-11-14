import { ViajeroService } from '../services/viajeroService.js'
import { validateViajero, validatePartialViajero } from '../schema/viajeroSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'

export class ViajeroController {
  static async listViajeros (req, res) {
    try {
      const viajeros = await ViajeroService.listViajeros()
      
      res.status(200).json({
        success: true,
        data: viajeros,
        message: 'Viajeros obtenidos exitosamente'
      })
    } catch (error) {
      console.error('Error in listViajeros:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener los viajeros',
        details: error.message
      })
    }
  }

  static async getViajeroById (req, res) {
    try {
      const { id_viajero } = req.params
      const viajero = await ViajeroService.getViajeroById({ id_viajero: parseInt(id_viajero) })
      
      res.status(200).json({
        success: true,
        data: viajero,
        message: 'Viajero obtenido exitosamente'
      })
    } catch (error) {
      console.error('Error in getViajeroById:', error)
      if (error.code === 'VIAJERO_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al obtener el viajero',
        details: error.message
      })
    }
  }

  static async getViajerosByUsuario (req, res) {
    try {
      const { usuario_asociado } = req.params
      const viajeros = await ViajeroService.getViajerosByUsuario({ usuario_asociado })
      
      res.status(200).json({
        success: true,
        data: viajeros,
        message: 'Viajeros del usuario obtenidos exitosamente'
      })
    } catch (error) {
      console.error('Error in getViajerosByUsuario:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener los viajeros del usuario',
        details: error.message
      })
    }
  }

  static async createViajero (req, res) {
    const validation = validateViajero(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de viajero inválidos',
        details: validation.error.issues
      })
    }

    try {
      const viajero = await ViajeroService.create({ viajero: req.body })
      res.status(201).json({
        success: true,
        data: viajero,
        message: 'Viajero creado exitosamente'
      })
    } catch (error) {
      console.error('Error in createViajero:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al crear el viajero',
        details: error.message
      })
    }
  }

  static async updateViajero (req, res) {
    const validation = validatePartialViajero(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de viajero inválidos',
        details: validation.error.issues
      })
    }

    try {
      const { id_viajero } = req.params
      const updatedViajero = await ViajeroService.update({ 
        id_viajero: parseInt(id_viajero), 
        viajeroData: req.body 
      })
      
      res.status(200).json({
        success: true,
        data: updatedViajero,
        message: 'Viajero actualizado exitosamente'
      })
    } catch (error) {
      console.error('Error in updateViajero:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al actualizar el viajero',
        details: error.message
      })
    }
  }

  static async deleteViajero (req, res) {
    try {
      const { id_viajero } = req.params
      const result = await ViajeroService.delete({ id_viajero: parseInt(id_viajero) })
      res.status(200).json(result)
    } catch (error) {
      console.error('Error in deleteViajero:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al eliminar el viajero',
        details: error.message
      })
    }
  }
}
