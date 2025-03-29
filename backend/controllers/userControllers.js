const pool = require("../config/db");

exports.getProfile = async (req, res) => {  
    try {
        const userId = req.user.userId;
        console.log(userId);
        const result = await pool.query("SELECT name, nickname, total_cans FROM users WHERE id = $1", [userId]);

        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo el perfil" });
    }
}

exports.getRanking = async (req, res) => {
    try {
        const result = await pool.query("SELECT name, nickname, total_cans FROM users ORDER BY total_cans DESC LIMIT 10");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo el ranking" });
    }
}