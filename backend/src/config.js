const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './database.sqlite';

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'development_secret_change_me',
  dbFile: path.resolve(__dirname, '..', dbFile)
};
