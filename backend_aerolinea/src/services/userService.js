const userRepo = require('../repositories/userRepository');

async function listUsers() {
  return await userRepo.getAllUsers();
}

async function addUser(data) {
  // aquí podrías validar cosas: correo único, longitud, etc.
  return await userRepo.createUser(data);
}

async function updateUser(id, userData) {
  return await userRepo.updateUser(id, userData);
}

async function deleteUser(id) {
  return await userRepo.deleteUser(id);
}

async function login(email, password) {
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Comparación de contraseña (sin hash por ahora)
  if (user.contrasena !== password) {
    throw new Error('Contraseña incorrecta');
  }

  // Si todo bien, retornamos info del usuario (sin contraseña)
  const { contrasena, ...userData } = user.toJSON();
  return userData;
}

module.exports = { listUsers, addUser, updateUser, deleteUser, login };
