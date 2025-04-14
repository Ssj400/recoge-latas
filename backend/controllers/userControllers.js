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
