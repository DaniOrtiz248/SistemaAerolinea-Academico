import {vueloRepository} from '../repositories/vueloRepository.js'
import { AppError } from '../utils/appError.js'
import { ValidationError } from '../utils/validateError.js'

export class flightService {
    static errors = []

    static async listFlights () {
        return await vueloRepository.getAll()
    }
    static async create ({ vuelo }) {
        
        if (this.errors.length > 0) {
            const errors = this.errors
            this.errors = []
            throw new ValidationError(errors)
        }

        try{
            return await vueloRepository.create({ vuelo })
        return await vueloRepository.create({ vuelo })
        }catch(error){
            console.log('Error programando el vuelo:', error);
            throw error
        }
}
}