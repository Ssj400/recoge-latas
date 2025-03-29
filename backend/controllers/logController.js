const pool = require("../config/db");

exports.getLogs = async (req, res) => {
    try {
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

exports.getAvailableNames = async (req, res) => {
    try {
        const result = await pool.query("SELECT name FROM users WHERE nickname IS NULL");
        res.json(result.rows.map(row => row.name));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo nombres disponibles" });
    }
};
