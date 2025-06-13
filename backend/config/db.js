// =============================================
// File: db.js
// Description: Database connection configuration.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

require("dotenv").config();
const { Pool } = require("pg");

// Create a new pool instance with the database connection settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
