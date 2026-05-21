const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { dbFile } = require('./config');

let dbInstance = null;

async function initDb() {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS campaign_briefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      platform TEXT NOT NULL,
      objective TEXT NOT NULL,
      budget REAL NOT NULL,
      start_date TEXT,
      deadline TEXT NOT NULL,
      target_audience TEXT,
      priority TEXT NOT NULL DEFAULT 'Medium',
      status TEXT NOT NULL DEFAULT 'Draft',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return dbInstance;
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database has not been initialized. Call initDb() before using getDb().');
  }

  return dbInstance;
}

module.exports = {
  initDb,
  getDb
};
