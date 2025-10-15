import { validateRoute } from '../schema/routeSchemas.js'

export class RouteController {
  static async create (req, res) {
    const validation = validateRoute(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      if (req.body.esNacional === 1) {
         
      }
      req.body = 3 // Forzar rol de cliente
      const created = await UserService.create(req.body)
      res.status(201).json(created)
    } catch (err) {
      console.error(err)
      if (err instanceof ValidationError) {
        const formatted = formatErrors(err)
        return res.status(formatted.status).json(formatted.error)
      }
      res.status(500).json({ error: 'Error al crear usuario' })
    }
  }
}
