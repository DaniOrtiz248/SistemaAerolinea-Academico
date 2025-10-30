// utils/generateRouteCode.js
import Ruta from '../models/ruta.js'
import { Op } from 'sequelize'

export async function generateRouteCode (esNacional) {
  console.log('Generando código para ruta', esNacional ? 'nacional' : 'internacional')
  
  const rangoInicio = esNacional ? 1 : 500
  const rangoFin = esNacional ? 499 : 999

  // Buscar todas las rutas del mismo tipo para encontrar el código más alto
  const rutas = await Ruta.findAll({
    where: { 
      es_nacional: esNacional,
      codigo_ruta: {
        [Op.like]: 'AP%'
      }
    },
    attributes: ['codigo_ruta'],
    order: [['codigo_ruta', 'DESC']]
  })

  let nextNum = rangoInicio

  if (rutas && rutas.length > 0) {
    // Extraer todos los números de los códigos y encontrar el más alto
    const numeros = rutas
      .map(r => {
        const match = r.codigo_ruta.match(/^AP(\d+)$/)
        return match ? parseInt(match[1], 10) : 0
      })
      .filter(num => num >= rangoInicio && num < rangoFin)
      .sort((a, b) => b - a)

    if (numeros.length > 0) {
      const maxNum = numeros[0]
      nextNum = maxNum + 1
    }
  }

  // Verificar que no exceda el límite
  if (nextNum > rangoFin) {
    throw new Error(`Se alcanzó el límite de rutas (${rangoFin}) para ${esNacional ? 'nacionales' : 'internacionales'}`)
  }

  // Formatear con ceros a la izquierda
  const code = `AP${String(nextNum).padStart(3, '0')}`
  
  // Verificar que el código no exista (seguridad adicional)
  const existingCode = await Ruta.findOne({
    where: { codigo_ruta: code }
  })

  if (existingCode) {
    console.error(`Código ${code} ya existe, generando siguiente...`)
    // Si por alguna razón existe, intentar con el siguiente
    return generateRouteCode(esNacional)
  }

  console.log(`Código generado: ${code}`)
  return code
}
