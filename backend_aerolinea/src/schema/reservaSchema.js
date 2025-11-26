import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

const reservaSchema = z.object({
  id_reserva: z.number().int().positive().optional(),
  codigo_reserva: z.string().min(1),
  usuario_id: z.number().int().positive(),
  clase_reserva: z.enum(['PRIMERACLASE', 'SEGUNDACLASE']),
  fecha_reserva: z.preprocess(transformEmptyToUndefined, z.string().refine((d) => {
    const t = Date.parse(d)
    return !isNaN(t)
  }, { message: 'Fecha de reserva inválida' })),
  estado_reserva: z.enum(['ACTIVA', 'CANCELADA', 'PAGADA']),
  cantidad_viajeros: z.number().int().min(1)
})

const partialReservaSchema = reservaSchema.partial()

export function validateReserva (object) {
  return reservaSchema.safeParse(object)
}

export function validatePartialReserva (object) {
  return partialReservaSchema.safeParse(object)
}
