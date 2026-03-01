const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

let db;

function getDatabase() {
  if (db) return db;

  const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH);
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  return db;
}

function initializeDatabase() {
  const database = getDatabase();

  // Run schema
  const schemaPath = path.resolve(__dirname, '../db/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  database.exec(schema);

  // Run seed if issues table is empty
  const count = database.prepare('SELECT COUNT(*) as count FROM issues').get();
  if (count.count === 0) {
    const seedPath = path.resolve(__dirname, '../db/seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf-8');
    database.exec(seed);
    console.log('Database seeded with sample data.');
  }

  console.log('Database initialized.');
}

module.exports = { getDatabase, initializeDatabase };
