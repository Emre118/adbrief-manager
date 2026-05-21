function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: error.message || 'Internal server error'
  };

  if (error.details) {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}

module.exports = sendError;
