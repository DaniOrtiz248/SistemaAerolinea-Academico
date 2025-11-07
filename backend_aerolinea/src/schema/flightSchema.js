import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

const flightSchema = z.object({
  estado: z.number().int().min(0), // Required
  fecha_vuelo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.null()), // DATEONLY
  hora_salida_vuelo: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).or(z.null()), // TIMESTAMP
  ruta_relacionada: z.number().int().positive(), // Required
  porcentaje_promocion: z.number().min(0).optional() // Optional
})

// Schema para validar vuelos parciales (updates)
const partialFlightSchema = flightSchema.partial()

export function validateFlight (object) {
  return flightSchema.safeParse(object)
}

export function validatePartialFlight (object) {
  return partialFlightSchema.safeParse(object)
}

// export function validateCreateFlight (object) {
//   return createFlightSchema.safeParse(object)
// }
