import Tarjeta from '../models/info_tarjeta.js'

export class TarjetaRepository {
  static async create (tarjetaData) {
    return await Tarjeta.create(tarjetaData)
  }

  static async findById (id_info_tarjeta) {
    return await Tarjeta.findByPk(id_info_tarjeta)
  }

  static async update (id_info_tarjeta, updateData) {
    const tarjeta = await Tarjeta.findByPk(id_info_tarjeta)
    if (!tarjeta) {
      return null
    }
    return await tarjeta.update(updateData)
  }

  static async delete (id_info_tarjeta) {
    const tarjeta = await Tarjeta.findByPk(id_info_tarjeta)
    if (!tarjeta) {
      return null
    }
    await tarjeta.destroy()
    return tarjeta
  }

  static async findByUsuarioId (id_usuario_tarjeta) {
    return await Tarjeta.findAll({ where: { id_usuario_tarjeta } })
  }

  static async aumentarSaldo (id_info_tarjeta, monto) {
    const tarjeta = await Tarjeta.findByPk(id_info_tarjeta)
    if (!tarjeta) {
      return null
    }
    const nuevoSaldo = parseFloat(tarjeta.saldo) + parseFloat(monto)
    return await tarjeta.update({ saldo: nuevoSaldo })
  }

  static async disminuirSaldo (id_info_tarjeta, monto) {
    const tarjeta = await Tarjeta.findByPk(id_info_tarjeta)
    if (!tarjeta) {
      return null
    }
    const nuevoSaldo = parseFloat(tarjeta.saldo) - parseFloat(monto)
    if (nuevoSaldo < 0) {
      throw new Error('Saldo insuficiente')
    }
    return await tarjeta.update({ saldo: nuevoSaldo })
  }
}
