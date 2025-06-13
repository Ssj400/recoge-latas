// =============================================
// File: monitorControllers.js
// Description: Handles monitoring operations such as pinging the server and database.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");

// Function to ping the server and check if it's alive
exports.ping = async (req, res) => {
  res.status(200).json({ message: "Server is alive!" });
};

// Function to ping the database and check if it's alive
exports.pingDb = async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ message: "Database is alive!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
