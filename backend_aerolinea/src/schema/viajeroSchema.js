import z from 'zod'

const viajeroSchema = z.object({
  dni_viajero: z.string().min(1),
  primer_nombre: z.string().min(1),
  segundo_nombre: z.string().optional(),
  primer_apellido: z.string().min(1),
  segundo_apellido: z.string().optional(),
  fecha_nacimiento: z.string().or(z.date()),
  id_genero: z.number().int().positive(),
  telefono: z.string().optional(),
  correo_electronico: z.string().email().optional(),
  nombre_contacto: z.string().min(1),
  telefono_contacto: z.string().min(1),
  usuario_asociado: z.string().min(1),
  hizo_checkin: z.number().int().min(0).max(1).optional()
})

const partialViajeroSchema = viajeroSchema.partial()

export function validateViajero (object) {
  return viajeroSchema.safeParse(object)
}

export function validatePartialViajero (object) {
  return partialViajeroSchema.safeParse(object)
}
