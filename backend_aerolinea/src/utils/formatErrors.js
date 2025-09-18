import { ValidationError } from '../utils/validateError.js'

export function formatErrors (errors) {
  let err = {}
  if (errors instanceof ValidationError) {
    err = {
      status: errors.status,
      error: {
        code: 'VALIDATION_ERROR',
        fields: errors.errors.map(e => ({
          field: e.field,
          status: e.status,
          code: e.code,
          message: e.message
        }))
      }
    }
  }

  return err
}
