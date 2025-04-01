const pool = require("../config/db");

exports.ping = async (req, res) => {
    res.status(200).json({ message: "Server is alive!" });
};

exports.pingDb = async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ message: "Database is alive!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}