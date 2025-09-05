const express = require("express");
const sequelize = require("./config/database");

const app = express();
app.use(express.json());

// Ejemplo de modelo
const User = sequelize.define("User", {
  name: { type: require("sequelize").STRING },
  email: { type: require("sequelize").STRING }
});

// Sincronizar tablas
sequelize.sync();

app.get("/", (req, res) => res.send("API conectada con Clever Cloud 🚀"));

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
