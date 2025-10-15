import { validateRoute } from '../schema/routeSchemas.js'
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
}
