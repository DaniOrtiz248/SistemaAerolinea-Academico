import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

const routeSchema = z.object({
  // codigo_ruta: z.string().min(1).max(6), // Required
  es_nacional: z.number().int().min(0).max(1), // Required BIT
  precio_primer_clase: z.number().min(0), // Required BIGINT
  precio_segunda_clase: z.number().min(0), // Required BIGINT
  ciudad_origen: z.number().int().positive(), // Required
  ciudad_destino: z.number().int().positive() // Required
})

export function validateRoute (object) {
  return routeSchema.safeParse(object)
}

export function validatePartialRoute (object) {
  return routeSchema.partial().safeParse(object)
}
