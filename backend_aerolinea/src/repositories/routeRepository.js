import Ruta from '../models/ruta.js'

export class RouteRepository {
  static async create ({ route }) {
    return await Ruta.create(route)
  }
}
