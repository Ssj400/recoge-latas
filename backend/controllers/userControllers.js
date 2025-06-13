// =============================================
// File: userControllers.js
// Description: Handles user profile operations, including fetching profile details, rankings, history, and statistics.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");

// Function to get the user's profile
exports.getProfile = async (req, res) => {
  try {
    // Get the user ID from the request object
    const userId = req.user.userId;

    // Query to get the user's profile details
    const result = await pool.query(
      "SELECT name, nickname, total_cans FROM users WHERE id = $1",
      [userId]
    );

    // If the user is the last in the ranking, set the 'last' property to true
    const lastPlace = await pool.query(
      "SELECT name, nickname, total_cans, id FROM users ORDER BY total_cans ASC LIMIT 1"
    );

    if (userId === lastPlace.rows[0].id) {
      result.rows[0].last = true;
    }

    // If no user is found, return a 404 error
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el perfil" });
  }
};

// Function to get the ranking of users
exports.getRanking = async (req, res) => {
  try {
    // Query to get the top 10 users ordered by total cans
    const result = await pool.query(
      "SELECT name, nickname, total_cans FROM users ORDER BY total_cans DESC LIMIT 10"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el ranking" });
  }
};

// Function to get the weekly ranking of users
exports.getWeeklyRanking = async (req, res) => {
  try {
    // Query to get the top 10 users based on cans collected in the last 7 days
    const result = await pool.query(`
         SELECT
        u.name,
        u.nickname,
        COALESCE(SUM(
          CASE
            WHEN c.date >= CURRENT_DATE - INTERVAL '7 days' THEN c.amount
            ELSE 0
          END
        ), 0) AS total_cans_last_week
      FROM users u
      LEFT JOIN collects c ON u.id = c.user_id
      GROUP BY u.id
      ORDER BY total_cans_last_week DESC
      LIMIT 10
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el ranking semanal" });
  }
};

// Function to get the user's history of actions
exports.getHistory = async (req, res) => {
  try {
    // Get the user ID from the request object
    const userId = req.user.userId;

    // Query to get the user's history of actions
    const result = await pool.query(
      "SELECT * FROM logs WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el historial" });
  }
};

// Function to delete a history item
exports.deleteHistoryItem = async (req, res) => {
  try {
    // Get the user ID from the request object and the log ID from the request parameters
    const userId = req.user.userId;
    const logId = req.params.id;

    // Get the log entry to ensure it belongs to the user
    const collectResult = await pool.query(
      "SELECT amount FROM collects WHERE log_id = $1 AND user_id = $2",
      [logId, userId]
    );

    // If no collect entry is found, return a 404 error
    if (collectResult.rows.length > 0) {
      const amount = collectResult.rows[0].amount;

      // Update the user's total cans count
      await pool.query(
        "UPDATE users SET total_cans = total_cans - $1 WHERE id = $2",
        [amount, userId]
      );

      // Delete the collect entry associated with the log
      await pool.query("DELETE FROM collects WHERE log_id = $1", [logId]);
    }

    // Delete the log entry
    let result = await pool.query(
      "DELETE FROM logs WHERE id = $1 AND user_id = $2",
      [logId, userId]
    );

    // If no log entry is found, return a 404 error
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Log no encontrado o ya eliminado" });
    }

    res.status(200).json({ message: "Elemento eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando historial:", error);
    res.status(500).json({ error: "Error eliminando elemento" });
  }
};

// Function to get user statistics
exports.getUserStats = async (req, res) => {
  const client = await pool.connect();
  try {
    // Get the user ID from the request object
    const userId = req.user.userId;

    // Query to get the group ID of the user
    const groupResult = await client.query(
      `SELECT group_id FROM users WHERE id = $1`,
      [userId]
    );

    const groupId = groupResult.rows[0]?.group_id;

    // If no group is found, return a 404 error
    if (!groupId) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    // Query to get the users in the group
    const usersResult = await client.query(
      `SELECT id, name FROM users WHERE group_id = $1`,
      [groupId]
    );
    const users = usersResult.rows;

    // Query to get the statistics for each user in the group
    const query = `
      WITH date_series AS (
        SELECT generate_series(
          (SELECT MIN(date) FROM collects WHERE user_id IN (
            SELECT id FROM users WHERE group_id = $1
          )),
          CURRENT_DATE+ INTERVAL '1 day',
          '1 day'
        )::date AS date
      ),
      user_collects AS (
        SELECT
          c.user_id,
          DATE(c.date AT TIME ZONE 'America/Santiago') AS date,
          SUM(c.amount) AS total
        FROM collects c
        JOIN users u ON u.id = c.user_id
        WHERE u.group_id = $1
        GROUP BY c.user_id, DATE(c.date AT TIME ZONE 'America/Santiago')
      )
      
      SELECT
        ds.date,
        uc.user_id,
        COALESCE(uc.total, 0) AS total
      FROM date_series ds
      CROSS JOIN (
        SELECT id AS user_id FROM users WHERE group_id = $1
      ) u
      LEFT JOIN user_collects uc
        ON uc.user_id = u.user_id AND uc.date = ds.date
      ORDER BY ds.date, uc.user_id;
    `;

    const result = await client.query(query, [groupId]);

    res.json({
      groupMembers: users,
      stats: result.rows,
    });
  } catch (error) {
    console.error("Error on getUserStats", error);
    res.status(500).json({ error: "Error getting stats" });
  } finally {
    client.release();
  }
};
