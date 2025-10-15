import { RouteRepository } from '../repositories/routeRepository.js'

export class RouteService {
  static async create (route) {
    return await RouteRepository.create({ route })
  }

  static async getAll () {
    return await RouteRepository.getAll()
  }
}
