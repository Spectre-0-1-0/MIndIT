const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration - using SQLite for development
const dbPath = path.join(__dirname, '../../data/mindcheck.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Test database connection and create tables
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    // Create tables if they don't exist
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS bfi10_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        submission_mode TEXT CHECK(submission_mode IN ('anonymous', 'identified')),
        consent_given BOOLEAN DEFAULT 0,
        responses TEXT, -- JSON string
        scores TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_bfi10_submissions_created_at ON bfi10_submissions(created_at);
      CREATE INDEX IF NOT EXISTS idx_bfi10_submissions_user_id ON bfi10_submissions(user_id);
    `;

    db.exec(createTablesSQL, (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err);
        reject(err);
      } else {
        console.log('✅ Database tables initialized');
        resolve();
      }
    });
  });
};

// Insert default admin user if not exists
const createDefaultAdmin = () => {
  return new Promise((resolve, reject) => {
    const bcrypt = require('bcryptjs');
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'MUdaanM';

    // Check if admin user exists
    db.get('SELECT id FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        // Admin user already exists
        resolve();
        return;
      }

      // Create admin user
      bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }

        db.run(
          'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
          ['admin', hashedPassword],
          function(err) {
            if (err) {
              reject(err);
            } else {
              console.log('✅ Default admin user created');
              resolve();
            }
          }
        );
      });
    });
  });
};

// Initialize database with default admin user
const initializeDatabaseWithAdmin = async () => {
  try {
    await initializeDatabase();
    await createDefaultAdmin();
    console.log('✅ Database fully initialized with admin user');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    throw err;
  }
};

module.exports = {
  db,
  initializeDatabase: initializeDatabaseWithAdmin
};