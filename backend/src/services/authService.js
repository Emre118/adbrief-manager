const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const AppError = require('../utils/AppError');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');

function mapUserRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    jwtSecret,
    { expiresIn: '2h' }
  );
}

async function registerUser(db, input) {
  const validation = validateRegisterInput(input);

  if (!validation.isValid) {
    throw new AppError('Validation failed.', 400, validation.errors);
  }

  const { name, email, password } = validation.data;
  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);

  if (existingUser) {
    throw new AppError('This email is already registered.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  const userRow = await db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [result.lastID]
  );

  const user = mapUserRow(userRow);

  return {
    user,
    token: createToken(user)
  };
}

async function loginUser(db, input) {
  const validation = validateLoginInput(input);

  if (!validation.isValid) {
    throw new AppError('Validation failed.', 400, validation.errors);
  }

  const { email, password } = validation.data;
  const userRow = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (!userRow) {
    throw new AppError('Invalid email or password.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, userRow.password_hash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = mapUserRow(userRow);

  return {
    user,
    token: createToken(user)
  };
}

module.exports = {
  createToken,
  registerUser,
  loginUser,
  mapUserRow
};
