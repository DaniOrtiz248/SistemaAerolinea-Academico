const { Usuario } = require('../models'); // Asegúrate de tener un index.js en /models que exporte Usuario

async function getAllUsers() {
  return await Usuario.findAll();
}

async function createUser(userData) {
  return await Usuario.create(userData);
}

async function updateUser(id, userData) {
  const [updated] = await Usuario.update(userData, {
    where: { id_usuario: id }
  });
  if (updated === 0) {
    throw new Error('Usuario no encontrado o sin cambios');
  }
  return await Usuario.findByPk(id);
}

async function deleteUser(id) {
  const deleted = await Usuario.destroy({
    where: { id_usuario: id }
  });
  if (deleted === 0) {
    throw new Error('Usuario no encontrado');
  }
  return;
}

async function findByEmail(correo) {
  return await Usuario.findOne({ where: { correo_electronico: correo } });
}


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findByEmail
};
