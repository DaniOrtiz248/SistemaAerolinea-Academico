import { TiqueteService } from '../services/tiqueteService.js'
import { validateTiquete, validatePartialTiquete } from '../schema/tiqueteSchema.js'
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'

export class TiqueteController {
  static async listTiquetes (req, res) {
    try {
      const tiquetes = await TiqueteService.listTiquetes()
      
      res.status(200).json({
        success: true,
        data: tiquetes,
        message: 'Tiquetes obtenidos exitosamente'
      })
    } catch (error) {
      console.error('Error in listTiquetes:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener los tiquetes',
        details: error.message
      })
    }
  }

  static async getTiqueteById (req, res) {
    try {
      const { id_tiquete } = req.params
      const tiquete = await TiqueteService.getTiqueteById({ id_tiquete: parseInt(id_tiquete) })
      
      res.status(200).json({
        success: true,
        data: tiquete,
        message: 'Tiquete obtenido exitosamente'
      })
    } catch (error) {
      console.error('Error in getTiqueteById:', error)
      if (error.code === 'TIQUETE_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al obtener el tiquete',
        details: error.message
      })
    }
  }

  static async getTiquetesByCompra (req, res) {
    try {
      const { id_compra } = req.params
      const tiquetes = await TiqueteService.getTiquetesByCompra({ id_compra: parseInt(id_compra) })
      
      res.status(200).json({
        success: true,
        data: tiquetes,
        message: 'Tiquetes de la compra obtenidos exitosamente'
      })
    } catch (error) {
      console.error('Error in getTiquetesByCompra:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener los tiquetes de la compra',
        details: error.message
      })
    }
  }

  static async createTiquete (req, res) {
    const validation = validateTiquete(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de tiquete inválidos',
        details: validation.error.issues
      })
    }

    try {
      const tiquete = await TiqueteService.create({ tiquete: req.body })
      res.status(201).json({
        success: true,
        data: tiquete,
        message: 'Tiquete creado exitosamente'
      })
    } catch (error) {
      console.error('Error in createTiquete:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al crear el tiquete',
        details: error.message
      })
    }
  }

  static async updateTiquete (req, res) {
    const validation = validatePartialTiquete(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Datos de tiquete inválidos',
        details: validation.error.issues
      })
    }

    try {
      const { id_tiquete } = req.params
      const updatedTiquete = await TiqueteService.update({ 
        id_tiquete: parseInt(id_tiquete), 
        tiqueteData: req.body 
      })
      
      res.status(200).json({
        success: true,
        data: updatedTiquete,
        message: 'Tiquete actualizado exitosamente'
      })
    } catch (error) {
      console.error('Error in updateTiquete:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al actualizar el tiquete',
        details: error.message
      })
    }
  }

  static async deleteTiquete (req, res) {
    try {
      const { id_tiquete } = req.params
      const result = await TiqueteService.delete({ id_tiquete: parseInt(id_tiquete) })
      res.status(200).json(result)
    } catch (error) {
      console.error('Error in deleteTiquete:', error)
      if (error instanceof ValidationError) {
        const formatted = formatErrors(error)
        return res.status(formatted.status).json({
          success: false,
          ...formatted.error
        })
      }
      res.status(500).json({
        success: false,
        error: 'Error al eliminar el tiquete',
        details: error.message
      })
    }
  }
}
