import { validateRoute, validatePartialRoute } from '../schema/routeSchemas.js'
import { generateRouteCode } from '../utils/generateRouteCode.js'
import { RouteService } from '../services/routeService.js'
// import { ValidationError, formatErrors } from '../utils/errorFormatter.js'
export class RouteController {
  static async getAll (req, res) {
    try {
      const routes = await RouteService.getAll()
      return res.json(routes)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al obtener rutas' })
    }
  }

  static async create (req, res) {
    const validation = validateRoute(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      req.body.codigo_ruta = await generateRouteCode(req.body.es_nacional)
      const created = await RouteService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      // if (err instanceof ValidationError) {
      //   const formatted = formatErrors(err)
      //   return res.status(formatted.status).json(formatted.error)
      // }
      res.status(500).json({ error: 'Error al crear ruta' })
    }
  }

  static async update (req, res) {
    const validation = validatePartialRoute(req.body)
    if (!validation.success) {
      console.log(validation.error)
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      const updated = await RouteService.update(req.params.id, req.body)
      if (!updated) {
        return res.status(404).json({ error: 'Ruta no encontrada' })
      }
      res.json(updated)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al actualizar ruta' })
    }
  }
}
