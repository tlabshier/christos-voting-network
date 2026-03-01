const path = require('path');

function loadEnv() {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const required = ['CLAUDE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  // Defaults
  process.env.PORT = process.env.PORT || '3001';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  process.env.DB_PATH = process.env.DB_PATH || './data/christos.db';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
}

module.exports = { loadEnv };
