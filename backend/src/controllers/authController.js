const { getDb } = require('../db');
const sendError = require('../utils/errorResponse');
const { registerUser, loginUser } = require('../services/authService');

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

module.exports = {
  register,
  login
};
