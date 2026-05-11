const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
if (!DEFAULT_ADMIN_PASSWORD) {
  throw new Error('DEFAULT_ADMIN_PASSWORD environment variable is required');
}

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../../data/mindcheck.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
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
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        submission_mode TEXT CHECK(submission_mode IN ('anonymous', 'identified')),
        user_info TEXT,
        consent_given BOOLEAN DEFAULT 0,
        responses TEXT,
        scores TEXT,
        interpretation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_bfi10_submissions_created_at ON bfi10_submissions(created_at);
      CREATE INDEX IF NOT EXISTS idx_bfi10_submissions_user_id ON bfi10_submissions(user_id);
    `;

    db.exec(createTablesSQL, async (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err);
        reject(err);
        return;
      }

      try {
        await migrateBfi10Schema();
        console.log('✅ Database tables initialized');
        resolve();
      } catch (migrationErr) {
        console.error('❌ Error migrating database schema:', migrationErr);
        reject(migrationErr);
      }
    });
  });
};

const getTableInfo = (tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map((row) => row.name));
    });
  });
};

const migrateBfi10Schema = async () => {
  const tableName = 'bfi10_submissions';
  const columns = await getTableInfo(tableName).catch(() => []);
  const requiredColumns = [
    { name: 'timestamp', sql: "ALTER TABLE bfi10_submissions ADD COLUMN timestamp DATETIME DEFAULT CURRENT_TIMESTAMP" },
    { name: 'submission_mode', sql: "ALTER TABLE bfi10_submissions ADD COLUMN submission_mode TEXT CHECK(submission_mode IN ('anonymous', 'identified'))" },
    { name: 'user_info', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN user_info TEXT' },
    { name: 'consent_given', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN consent_given BOOLEAN DEFAULT 0' },
    { name: 'responses', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN responses TEXT' },
    { name: 'scores', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN scores TEXT' },
    { name: 'interpretation', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN interpretation TEXT' },
    { name: 'created_at', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', sql: 'ALTER TABLE bfi10_submissions ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP' },
  ];

  for (const column of requiredColumns) {
    if (!columns.includes(column.name)) {
      await new Promise((resolve, reject) => {
        db.run(column.sql, (err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`✅ Added missing column ${column.name} to ${tableName}`);
          resolve();
        });
      });
    }
  }
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
      bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }

        db.run(
          'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
          ['admin', hashedPassword, 'admin'],
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