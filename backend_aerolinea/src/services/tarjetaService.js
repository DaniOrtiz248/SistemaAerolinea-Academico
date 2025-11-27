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

  static async aumentarSaldo (id_info_tarjeta, monto) {
    try {
      if (!monto || monto <= 0) {
        throw new Error('El monto debe ser mayor a 0')
      }
      const tarjeta = await TarjetaRepository.aumentarSaldo(id_info_tarjeta, monto)
      return tarjeta
    } catch (error) {
      console.error('Error aumentando saldo:', error)
      throw error
    }
  }

  static async disminuirSaldo (id_info_tarjeta, monto) {
    try {
      if (!monto || monto <= 0) {
        throw new Error('El monto debe ser mayor a 0')
      }
      const tarjeta = await TarjetaRepository.disminuirSaldo(id_info_tarjeta, monto)
      return tarjeta
    } catch (error) {
      console.error('Error disminuyendo saldo:', error)
      throw error
    }
  }
}
