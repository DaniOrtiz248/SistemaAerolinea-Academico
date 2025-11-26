import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

const tarjetaSchema = z.object({
  id_info_tarjeta: z.number().int().positive().optional(),
  codigo_tarjeta: z.number().int().positive(),
  // fecha_vencimiento se espera como string (ISO) que Date.parse pueda entender
  fecha_vencimiento: z.preprocess(transformEmptyToUndefined, z.string().refine((d) => {
    const t = Date.parse(d)
    return !isNaN(t)
  }, { message: 'Fecha de vencimiento inválida' })),
  tipo_entidad: z.preprocess(transformEmptyToUndefined, z.string().min(2).max(100).optional()),
  CVC: z.number().int().min(0),
  saldo: z.number().min(0),
  id_usuario_tarjeta: z.string().min(1)
})

const partialTarjetaSchema = tarjetaSchema.partial()

export function validateTarjeta (object) {
  return tarjetaSchema.safeParse(object)
}

export function validatePartialTarjeta (object) {
  return partialTarjetaSchema.safeParse(object)
}
