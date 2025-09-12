// src/controllers/userController.js
const userService = require('../services/userService');

async function getUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

async function postUser(req, res) {
  try {
    const created = await userService.addUser(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

module.exports = { getUsers, postUser };
