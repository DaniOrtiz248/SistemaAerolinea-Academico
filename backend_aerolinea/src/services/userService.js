// src/services/userService.js
const userRepo = require('../repositories/userRepository');

async function listUsers() {
  return await userRepo.getAllUsers();
}

async function addUser(data) {
  // aquí podrías validar cosas: correo único, longitud, etc.
  return await userRepo.createUser(data);
}

module.exports = { listUsers, addUser };
