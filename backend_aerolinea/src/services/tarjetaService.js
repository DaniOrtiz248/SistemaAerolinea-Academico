import { TarjetaRepository } from '../repositories/tarjetaRepository.js'

export class TarjetaService {
  static async create (tarjeta) {
    try {
      return await TarjetaRepository.create(tarjeta)
    } catch (error) {
      console.error('Error creando tarjeta:', error)
      throw error
    }
  }

  static async getById (id_info_tarjeta) {
    try {
      const tarjeta = await TarjetaRepository.findById(id_info_tarjeta)
      return tarjeta
    } catch (error) {
      console.error('Error obteniendo tarjeta por ID:', error)
      throw error
    }
  }

  static async update (id_info_tarjeta, updateData) {
    try {
      const updatedTarjeta = await TarjetaRepository.update(id_info_tarjeta, updateData)
      return updatedTarjeta
    } catch (error) {
      console.error('Error actualizando tarjeta:', error)
      throw error
    }
  }

  static async delete (id_info_tarjeta) {
    try {
      const deletedTarjeta = await TarjetaRepository.delete(id_info_tarjeta)
      return deletedTarjeta
    } catch (error) {
      console.error('Error eliminando tarjeta:', error)
      throw error
    }
  }

  static async getByUsuarioId (id_usuario_tarjeta) {
    try {
      const tarjetas = await TarjetaRepository.findByUsuarioId(id_usuario_tarjeta)
      return tarjetas
    } catch (error) {
      console.error('Error obteniendo tarjetas por ID de usuario:', error)
      throw error
    }
  }
}
