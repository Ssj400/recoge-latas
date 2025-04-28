const pool = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      "SELECT name, nickname, total_cans FROM users WHERE id = $1",
      [userId]
    );
    const lastPlace = await pool.query(
      "SELECT name, nickname, total_cans, id FROM users ORDER BY total_cans ASC LIMIT 1"
    );

    if (userId === lastPlace.rows[0].id) {
      result.rows[0].last = true;
    }

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el perfil" });
  }
};

exports.getRanking = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, nickname, total_cans FROM users ORDER BY total_cans DESC LIMIT 10"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el ranking" });
  }
};

exports.getWeeklyRanking = async (req, res) => {
  try {
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

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
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

exports.deleteHistoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logId = req.params.id;

    const collectResult = await pool.query(
      "SELECT amount FROM collects WHERE log_id = $1 AND user_id = $2",
      [logId, userId]
    );

    if (collectResult.rows.length > 0) {
      const amount = collectResult.rows[0].amount;

      await pool.query(
        "UPDATE users SET total_cans = total_cans - $1 WHERE id = $2",
        [amount, userId]
      );

      await pool.query("DELETE FROM collects WHERE log_id = $1", [logId]);
    }

    let result = await pool.query(
      "DELETE FROM logs WHERE id = $1 AND user_id = $2",
      [logId, userId]
    );

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

exports.getUserStats = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;

    const groupResult = await client.query(
      `SELECT group_id FROM users WHERE id = $1`,
      [userId]
    );
    const groupId = groupResult.rows[0]?.group_id;

    if (!groupId) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    const usersResult = await client.query(
      `SELECT id, name FROM users WHERE group_id = $1`,
      [groupId]
    );
    const users = usersResult.rows;

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
