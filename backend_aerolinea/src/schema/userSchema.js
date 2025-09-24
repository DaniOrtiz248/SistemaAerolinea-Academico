import z from 'zod'

function transformEmptyToUndefined (val) {
  if (typeof val === 'string' && val.trim() === '') return undefined
  return val
}

// Esquema de validación para la creación y actualización de usuarios
const userSchema = z.object({
  usuario: z.object({
    descripcion_usuario: z.string().min(3).max(50),
    correo_electronico: z.string().email().max(100),
    contrasena: z.string().min(6).max(100),
    id_rol: z.number().int().positive()
  }),
  usuarioPerfil: z.object({
    dni_usuario: z.string().min(8).max(12),
    primer_nombre: z.string().min(2).max(100),
    segundo_nombre: z.preprocess(transformEmptyToUndefined, z.string().min(2).max(100).optional()),
    primer_apellido: z.string().min(2).max(100),
    segundo_apellido: z.preprocess(transformEmptyToUndefined, z.string().min(2).max(100).optional()),
    pais_nacimiento: z.string().min(2).max(100),
    provincia_nacimiento: z.string().min(2).max(100),
    ciudad_nacimiento: z.string().min(2).max(100),
    fecha_nacimiento: z.string().refine((date) => {
      const fecha = Date.parse(date)
      // Verifica que la fecha sea válida
      if (isNaN(fecha)) return false
      // Verifica que la fecha no sea anterior a 1900-01-01
      if (fecha - new Date('1900-01-01') < 0) return false

      // Verifica que la edad esté entre 18 y 100 años
      const edad = (Date.now() - fecha) / (1000 * 60 * 60 * 24 * 365)
      if (edad < 18 || edad > 100) return false

      return true
    }, { message: 'Fecha de nacimiento inválida' }),
    direccion_facturacion: z.string().min(5).max(200),
    id_genero_usuario: z.number().int().positive()
  })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}
