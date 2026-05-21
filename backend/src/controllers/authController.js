const { getDb } = require('../db');
const sendError = require('../utils/errorResponse');
const { registerUser, loginUser, getCurrentUser } = require('../services/authService');

async function register(req, res) {
  try {
    const result = await registerUser(getDb(), req.body);
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

async function login(req, res) {
  try {
    const result = await loginUser(getDb(), req.body);
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

async function me(req, res) {
  try {
    const user = await getCurrentUser(getDb(), req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  register,
  login,
  me
};
