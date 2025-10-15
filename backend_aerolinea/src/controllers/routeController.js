export class RouteController {
  static async create (req, res) {
    const validation = validateUser(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues })
    }
    try {
      req.body.usuario.id_rol = 3 // Forzar rol de cliente
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
