const sqlite3 = require('sqlite3').verbose();

// Initialize database
const db = new sqlite3.Database('./database/rules.db', (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create table for rules
    db.run(`
      CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rule_text TEXT NOT NULL,
        ast TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Failed to create rules table:', err.message);
      } else {
        console.log('Rules table initialized successfully.');
      }
    });
  }
});

module.exports = db;
