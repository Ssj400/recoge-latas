// =============================================
// File: logController.js
// Description: Handles logging operations, including fetching logs and available names.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");

// Function to get logs from the database
exports.getLogs = async (req, res) => {
  try {
    // Query to fetch logs with user nicknames
    const logs = await pool.query(`
            SELECT users.nickname, logs.action, logs.timestamp
            FROM logs
            JOIN users ON logs.user_id = users.id
            ORDER BY logs.timestamp DESC
        `);
    res.status(200).json(logs.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo logs" });
  }
};

// Fuunction to get available names (users without a nickname)
exports.getAvailableNames = async (req, res) => {
  try {
    // Query to fetch names of users who do not have a nickname
    const result = await pool.query(
      "SELECT name FROM users WHERE nickname IS NULL"
    );
    res.json(result.rows.map((row) => row.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo nombres disponibles" });
  }
};
