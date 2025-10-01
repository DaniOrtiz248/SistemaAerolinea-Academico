import { flightService } from "../services/flightService";
import { ValidationError } from '../utils/validateError.js'
import { formatErrors } from '../utils/formatErrors.js'

export class flightController {
    static async listFlights (req, res) {
        try {
            const vuelos = await flightService.listFlights()
            res.json(vuelos)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Error al obtener los vuelos' })
        }
    }

    static async createFlight (req, res) {
        try {
            const vuelo = req.body
            const nuevoVuelo = await flightService.create({ vuelo })
            res.status(201).json(nuevoVuelo)
        } catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({ errors: formatErrors(err.errors) })
            } else {
                console.error(err)
                res.status(500).json({ error: 'Error al crear el vuelo' })
            }
        }
    }
}