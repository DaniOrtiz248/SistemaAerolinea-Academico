import Vuelo from '../models/vuelo.js'

export class FlightRepository {
    static async getAll () {
    return await Vuelo.findAll()
    }

    static async create ({ vuelo }) {
        return await Vuelo.create(vuelo)
    }



}