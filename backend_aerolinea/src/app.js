// src/app.js
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/v1/users', userRoutes);

// Manejo de errores
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicio del servidor
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos (Clever Cloud)');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.log('🛠️ Modelos sincronizados con la BD');
    }

    app.listen(PORT, () =>
      console.log(`🚀 Servidor en ejecución: http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Error de conexión a la BD:', err.message);
    process.exit(1);
  }
}

start();


