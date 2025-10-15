import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

const routeSchema = z.object({
  codigo_ruta: z.string().min(1).max(6), // Required
  esNacional: z.number().int().min(0).max(1), // Required BIT
  precio_primer_clase: z.number().min(0), // Required BIGINT
  precio_economica: z.number().min(0), // Required BIGINT
  ciudad_origen: z.number().int().positive(), // Required
  ciudad_destino: z.number().int().positive(), // Required
  
})