const pool = require("../config/db");

exports.addCollect = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("📥 Datos recibidos:", req.body, "userId:", userId);
    const { amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await pool.query("INSERT INTO collects (user_id, amount) VALUES ($1, $2)", [
      userId,
      amount,
    ]);
    await pool.query(
      "UPDATE users SET total_cans = total_cans + $1 WHERE id = $2",
      [amount, userId]
    );
    await pool.query("INSERT INTO logs (user_id, action) VALUES ($1, $2)", [
      userId,
      `Sumó ${amount} latas`,
    ]);

    console.log("✅ POST exitoso, enviando respuesta...");
    return res.status(200).json({ message: "POST exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering collects" });
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
