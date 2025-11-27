import { SegmentoViajeService } from '../services/segmentoViajeService.js'

export class SegmentoViajeController {
  
  static async create (req, res) {
    try {
      const segmento = await SegmentoViajeService.create(req.body)
      res.status(201).json({
        success: true,
        data: segmento,
        message: 'Segmento de viaje creado exitosamente'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params
      const segmento = await SegmentoViajeService.getById(id)
      
      if (!segmento) {
        return res.status(404).json({
          success: false,
          message: 'Segmento de viaje no encontrado'
        })
      }

      res.status(200).json({
        success: true,
        data: segmento
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async getAllByViajeroId (req, res) {
    try {
      const { viajeroId } = req.params
      const segmentos = await SegmentoViajeService.getAllByViajeroId(viajeroId)
      
      res.status(200).json({
        success: true,
        data: segmentos,
        count: segmentos.length
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async getAllByReservaId (req, res) {
    try {
      const { reservaId } = req.params
      const segmentos = await SegmentoViajeService.findAllByReservaId(reservaId)
      
      res.status(200).json({
        success: true,
        data: segmentos,
        count: segmentos.length
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async update (req, res) {
    try {
      const { id } = req.params
      const segmento = await SegmentoViajeService.update(id, req.body)
      
      res.status(200).json({
        success: true,
        data: segmento,
        message: 'Segmento de viaje actualizado exitosamente'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params
      await SegmentoViajeService.delete(id)
      
      res.status(200).json({
        success: true,
        message: 'Segmento de viaje eliminado exitosamente'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  static async cambiarAsiento (req, res) {
    try {
      const { id } = req.params
      const { nuevo_asiento_id } = req.body

      if (!nuevo_asiento_id) {
        return res.status(400).json({
          success: false,
          message: 'El campo nuevo_asiento_id es requerido'
        })
      }

      const segmentoActualizado = await SegmentoViajeService.cambiarAsiento(
        parseInt(id),
        parseInt(nuevo_asiento_id)
      )

      res.status(200).json({
        success: true,
        data: segmentoActualizado,
        message: 'Asiento cambiado exitosamente'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  static async verificarCambioAsiento (req, res) {
    try {
      const { id } = req.params
      const resultado = await SegmentoViajeService.verificarCambioAsiento(parseInt(id))

      res.status(200).json({
        success: true,
        data: resultado
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}
