// utils/ValidationError.js
export class ValidationError extends Error {
  constructor (errors) {
    super('Validation failed')
    this.name = 'ValidationError'
    this.status = 400 // HTTP 400 Bad Request
    this.errors = errors // lista de errores detallados
  }
}
