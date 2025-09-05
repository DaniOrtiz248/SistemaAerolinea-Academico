require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProd = process.env.NODE_ENV === "production";
const needSSL = String(process.env.DB_SSL || "false").toLowerCase() === "true";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: !isProd, // logs SQL solo en dev
    timezone: "+00:00", // guarda en UTC; convierte en app si lo necesitas
    define: {
      underscored: true,
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // evita problemas de fechas y zonas horarias
      dateStrings: true,
      typeCast: true,
      // SSL si tu proveedor lo exige
      ssl: needSSL ? { require: true, rejectUnauthorized: false } : undefined
    }
  }
);

// Probar conexión al iniciar
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a MySQL Clever Cloud correctamente");
  } catch (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
  }
}

module.exports = { sequelize, testConnection };
