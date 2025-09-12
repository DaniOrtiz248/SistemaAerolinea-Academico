// src/repositories/userRepository.js
const { User } = require('../models');

async function getAllUsers() {
  return await User.findAll();
}

async function createUser(payload) {
  return await User.create(payload);
}

module.exports = { getAllUsers, createUser };
