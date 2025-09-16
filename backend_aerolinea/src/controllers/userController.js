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

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const updated = await userService.updateUser(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}

async function loginUser(req, res) {
  try {
    console.log('🟡 req.body recibido:', req.body);
    const { correo_electronico, contrasena } = req.body;

    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const user = await userService.login(correo_electronico, contrasena);
    res.json({ mensaje: 'Inicio de sesión exitoso', usuario: user });
    console.log(`✅ Login exitoso para el usuario: ${user.descripcion_usuario}`);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message || 'Error en inicio de sesión' });
  }
}

module.exports = { getUsers, postUser, updateUser, deleteUser, loginUser };
