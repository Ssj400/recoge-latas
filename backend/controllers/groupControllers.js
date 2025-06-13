// =============================================
// File: groupControllers.js
// Description: Handles group-related operations such as fetching group details, ranking, and weekly ranking.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");

exports.getGroup = async (req, res) => {
  // Get the user ID from the request object
  const userId = req.user.userId;

  try {
    // Query to get the group details for the user
    const result = await pool.query(
      `
            SELECT
              g.name AS grupo,
              COALESCE(SUM(u2.total_cans), 0) AS total_latas,
              STRING_AGG(u2.name, ', ') AS integrantes
            FROM users u
            JOIN groups g ON u.group_id = g.id
            LEFT JOIN users u2 ON u2.group_id = g.id
            WHERE u.id = $1
            GROUP BY g.name
          `,
      [userId]
    );

    // If no group is found, return a 404 error
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Grupo no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el grupo" });
  }
};

// Function to get the ranking of users in a group
exports.getGroupRanking = async (req, res) => {
  // Get the user ID from the request object
  const userId = req.user.userId;

  try {
    // Query to get the group ID of the user
    const groupResult = await pool.query(
      `
            SELECT group_id FROM users WHERE id = $1
          `,
      [userId]
    );

    // If no group is found, return a 404 error
    if (groupResult.rows.length === 0)
      return res.status(404).json({ error: "Grupo no encontrado" });

    // Get the group ID from the result
    const groupId = groupResult.rows[0].group_id;

    // Query to get the ranking of users in the group
    const result = await pool.query(
      `
            SELECT
              u.name as name,
              u.nickname as nickname,
              u.total_cans as total_cans
            FROM users u
            WHERE u.group_id = $1
            ORDER BY u.total_cans DESC   
          `,
      [groupId]
    );

    // If no users are found in the group, return a 404 error
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Grupo no encontrado" });

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el grupo" });
  }
};

// Function to get the weekly ranking of users in a group
exports.getGroupRankingWeekly = async (req, res) => {
  // Get the user ID from the request object
  const userId = req.user.userId;

  try {
    // Query to get the group ID of the user
    const groupResult = await pool.query(
      `SELECT group_id FROM users WHERE id = $1`,
      [userId]
    );

    // If no group is found, return a 404 error
    if (groupResult.rows.length === 0)
      return res.status(404).json({ error: "Grupo no encontrado" });

    // Get the group ID from the result
    const groupId = groupResult.rows[0].group_id;

    // Query to get the weekly ranking of users in the group
    const result = await pool.query(
      `
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
      WHERE u.group_id = $1
      GROUP BY u.id
      ORDER BY total_cans_last_week DESC
      `,
      [groupId]
    );

    // If no users are found in the group, return a 404 error
    if (result.rows.length === 0)
      return res.status(404).json({ error: "No hay usuarios en el grupo" });

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error obteniendo el ranking semanal del grupo" });
  }
};
