// utils/generateRouteCode.js
import Ruta from '../models/ruta.js'

export async function generateRouteCode (esNacional) {
  // Buscar la última ruta creada según tipo
  console.log('Generando código para ruta', esNacional ? 'nacional' : 'internacional')
  const ultimaRuta = await Ruta.findOne({
    where: { es_nacional: esNacional },
    order: [['created_at', 'DESC']]
  })

  const rangoInicio = esNacional ? 1 : 500
  const rangoFin = esNacional ? 499 : 999
  // Calcular nuevo número
  let nextNum = rangoInicio
  if (ultimaRuta && ultimaRuta.codigo_ruta) {
    const lastNum = parseInt(ultimaRuta.codigo_ruta.slice(2), 10)
    // Si el número anterior está dentro del rango válido, incrementar
    if (lastNum >= rangoInicio && lastNum < rangoFin) {
      nextNum = lastNum + 1
    } else if (lastNum >= rangoFin) {
      throw new Error(`Se alcanzó el límite de vuelos (${rangoFin}) para ${esNacional ? 'nacionales' : 'internacionales'}`)
    }
  }

  // Formatear con ceros a la izquierda
  const code = `AP${String(nextNum).padStart(3, '0')}`
  return code
}
