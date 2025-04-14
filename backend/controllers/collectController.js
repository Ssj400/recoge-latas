const pool = require("../config/db");

exports.addCollect = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await client.query("BEGIN");

    const logResult = await client.query(
      "INSERT INTO logs (user_id, action) VALUES ($1, $2) RETURNING id",
      [userId, `Sumó ${amount} latas`]
    );
    const logId = logResult.rows[0].id;

    await client.query(
      "INSERT INTO collects (user_id, amount, log_id) VALUES ($1, $2, $3)",
      [userId, amount, logId]
    );

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

exports.getTotal = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(amount) AS total FROM collects"
    );
    res.json({ total: result.rows[0].total || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting total amount of latas" });
  }
};
