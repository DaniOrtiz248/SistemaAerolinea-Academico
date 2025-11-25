import { AsientoRepository } from '../repositories/asientoRepository.js'

import fs from 'fs'

const asientosNacionales = fs.readFileSync('../asientos-json/asientosNacionales.json', 'utf8')
const asientosNacionalesJson = JSON.parse(asientosNacionales)

const asientosInternacionales = fs.readFileSync('../asientos-json/asientosInternacionales.json', 'utf8')
const asientosInternacionalesJson = JSON.parse(asientosInternacionales)

export class AsientoService {
  static async bulkCreate (vueloID, esNacional) {
    try {
      const asientoData = esNacional ? asientosNacionalesJson.map(asiento => ({ ...asiento, vuelo_id: vueloID })) : asientosInternacionalesJson.map(asiento => ({ ...asiento, vuelo_id: vueloID }))
      const asiento = await AsientoRepository.bulkCreate(asientoData)
      return asiento
    } catch (error) {
      console.error('Error creating asiento:', error)
      throw error
    }
  }

  static async getAsientoById (id_asiento) {
    try {
      const asiento = await AsientoRepository.findById(id_asiento)
      return asiento
    }catch (error) {
      console.error('Error getting asiento by ID:', error)
      throw error
    }
  }

  static async update (id_asiento, updateData) {
    try {
      const updatedRowsCount = await AsientoRepository.update(id_asiento, updateData)
      return updatedRowsCount
    } catch (error) {
      console.error('Error updating asiento:', error)
      throw error
    }
  }

  static async delete (id_asiento) {
    try {
      const deletedRowsCount = await AsientoRepository.delete(id_asiento)
      return deletedRowsCount
    } catch (error) {
      console.error('Error deleting asiento:', error)
      throw error
    }
  }

  static async getAsientosByVueloId (vuelo_id) {
    try {
      const asientos = await AsientoRepository.findAllByVueloId(vuelo_id)
      return asientos
    } catch (error) {
      console.error('Error getting asientos by vuelo ID:', error)
      throw error
    }
  }
}
