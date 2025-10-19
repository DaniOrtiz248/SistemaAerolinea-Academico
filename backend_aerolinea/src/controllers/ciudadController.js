import Ciudad from '../models/ciudad.js'

export class CiudadController {
  static async getAll (req, res) {
    try {
      const ciudades = await Ciudad.findAll({
        order: [['nombre_ciudad', 'ASC']]
      })
      res.status(200).json({
        success: true,
        data: ciudades,
        message: 'Ciudades obtenidas exitosamente'
      })
    } catch (error) {
      console.error('Error in getAll ciudades:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener las ciudades',
        details: error.message
      })
    }
  }
}
