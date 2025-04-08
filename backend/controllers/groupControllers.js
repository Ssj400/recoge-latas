const pool = require("../config/db");

exports.getGroup = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(`
            SELECT
              g.name AS grupo,
              COALESCE(SUM(u2.total_cans), 0) AS total_latas,
              STRING_AGG(u2.name, ', ') AS integrantes
            FROM users u
            JOIN groups g ON u.group_id = g.id
            LEFT JOIN users u2 ON u2.group_id = g.id
            WHERE u.id = $1
            GROUP BY g.name
          `,  [userId]);

        if (result.rows.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo el grupo" });
    }
}

exports.getGroupRanking = async (req, res) => {
    const userId = req.user.userId;

    try {
        const groupResult = await pool.query(`
            SELECT group_id FROM users WHERE id = $1
          `,  [userId]);

        if (groupResult.rows.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });


        const groupId = groupResult.rows[0].group_id;

        const result = await pool.query(`
            SELECT
              u.name as name,
              u.nickname as nickname,
              u.total_cans as total_cans
            FROM users u
            WHERE u.group_id = $1
            ORDER BY u.total_cans DESC   
          `,  [groupId]);

        if (result.rows.length === 0) return res.status(404).json({ error: "Grupo no encontrado" });

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo el grupo" });
    }
}