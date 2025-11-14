import z from 'zod'

const tiqueteSchema = z.object({
  codigo_tiquete: z.string().min(1),
  tipo_trayecto: z.number().int(),
  id_vuelo: z.number().int().positive(),
  costo_tiquete: z.number().int().positive(),
  clase_silla_tiquete: z.number().int(),
  maleta_extra: z.number().int().min(0),
  numero_silla: z.string().min(1),
  id_compra: z.number().int().positive(),
  id_viajero_tiquete: z.number().int().positive()
})

const partialTiqueteSchema = tiqueteSchema.partial()

export function validateTiquete (object) {
  return tiqueteSchema.safeParse(object)
}

export function validatePartialTiquete (object) {
  return partialTiqueteSchema.safeParse(object)
}
