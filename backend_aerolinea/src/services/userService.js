const userRepo = require('../repositories/userRepository');

async function listUsers() {
  return await userRepo.getAllUsers();
}

async function addUser(data) {
  // aquí podrías validar cosas: correo único, longitud, etc.
  return await userRepo.createUser(data);
}

async function updateUser(id, userData) {
  return await userRepository.updateUser(id, userData);
}

async function deleteUser(id) {
  return await userRepository.deleteUser(id);
}

module.exports = { listUsers, addUser, updateUser, deleteUser };
