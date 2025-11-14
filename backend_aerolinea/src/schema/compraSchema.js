import z from 'zod'

const compraSchema = z.object({
  fecha_compra: z.string().or(z.date()),
  valor_total: z.number().int().positive(),
  es_pago: z.number().int().min(0).max(1).optional()
})

const partialCompraSchema = compraSchema.partial()

export function validateCompra (object) {
  return compraSchema.safeParse(object)
}

export function validatePartialCompra (object) {
  return partialCompraSchema.safeParse(object)
}
