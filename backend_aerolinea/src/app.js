// src/app.js
import express, { json } from 'express'
import { sequelize } from './db/sequelize/sequelize.js'
import { userRoutes } from './routes/userRoutes.js'
import { flightRoutes } from './routes/flightRoutes.js'
import { imageRoutes } from './routes/imageRoutes.js'
import { corsMiddleware } from './middleware/cors.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(json())
app.use(cookieParser())

app.use(corsMiddleware())

// Rutas
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/uploads', imageRoutes)
app.use('/api/v1/flights', flightRoutes)
app.use('/api/v1/flights', flightRoutes)

// Manejo de errores
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Inicio del servidor
async function start () {
  try {
    await sequelize.authenticate()
    console.log('✅ Conectado a la base de datos correctamente')

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync()
      console.log('🛠️ Modelos sincronizados con la BD')
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor en ejecución: http://localhost:${PORT}`)
      console.log(`🌐 También accesible desde la red local en: http://[TU_IP]:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Error de conexión a la BD:', err.message)
    process.exit(1)
  }
}

start()
