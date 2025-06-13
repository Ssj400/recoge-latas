// =============================================
// File: collectController.js
// Description: Handles the collection of cans by users.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");

// Function that adds a new collection of cans by a user
exports.addCollect = async (req, res) => {
  //Connect to the database
  const client = await pool.connect();
  try {
    // Get the user ID from the request and the amount of cans to add
    const userId = req.user.userId;
    const { amount } = req.body;

    // Validate the input data
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await client.query("BEGIN");

    //Determine the current date in Chile's timezone
    const chileDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })
    );

    // Insert a new log entry for the collection
    const logResult = await client.query(
      "INSERT INTO logs (user_id, action, timestamp) VALUES ($1, $2, $3) RETURNING id",
      [userId, `Sumó ${amount} latas`, chileDate]
    );
    const logId = logResult.rows[0].id;

    // Insert the collection record into the collects table
    await client.query(
      "INSERT INTO collects (user_id, amount, log_id) VALUES ($1, $2, $3)",
      [userId, amount, logId]
    );

    // Update the user's total cans count
    await client.query(
      "UPDATE users SET total_cans = total_cans + $1 WHERE id = $2",
      [amount, userId]
    );

    await client.query("COMMIT");

    return res.status(200).json({ message: "POST exitoso" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error en addCollect:", error);
    res.status(500).json({ error: "Error registering collects" });
  } finally {
    client.release();
  }
};

// Function that retrieves the total amount of cans collected
exports.getTotal = async (req, res) => {
  try {
    // Query the database to get the total amount of cans collected
    const result = await pool.query(
      "SELECT SUM(amount) AS total FROM collects"
    );
    res.json({ total: result.rows[0].total || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting total amount of latas" });
  }
};
