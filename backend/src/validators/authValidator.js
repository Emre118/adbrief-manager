function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterInput(input = {}) {
  const errors = {};
  const data = {
    name: String(input.name || '').trim(),
    email: String(input.email || '').trim().toLowerCase(),
    password: String(input.password || '')
  };

  if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'A valid email address is required.';
  }

  if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data
  };
}

function validateLoginInput(input = {}) {
  const errors = {};
  const data = {
    email: String(input.email || '').trim().toLowerCase(),
    password: String(input.password || '')
  };

  if (!isValidEmail(data.email)) {
    errors.email = 'A valid email address is required.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
