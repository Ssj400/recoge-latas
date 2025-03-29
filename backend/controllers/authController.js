const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, nickname, password } = req.body;

        if (!name || !nickname || !password) return res.status(400).json({ error: "Faltan datos" });

        const client = await pool.connect();
        const userExists = await pool.query("SELECT * FROM users WHERE nickname = $1", [nickname]);

        if (userExists.rows.length > 0) {
            client.release();
            return res.status(400).json({ error: "El nickname ya está en uso"});
        }

        const availableUser = await pool.query("SELECT * FROM users WHERE name = $1 AND nickname IS NULL", [name]);
        if (availableUser.rows.length === 0) {
            client.release();
            return res.status(400).json({ error: "El nombre ya fue usado o no existe", });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await pool.query("UPDATE users SET nickname = $1, password = $2 WHERE id = $3 RETURNING *", [nickname, hashedPassword, availableUser.rows[0].id]);

        await pool.query("COMMIT");
        client.release();

        console.log("Nuevo usuario registrado:", updatedUser.rows[0]);


        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
}

exports.login = async (req, res) => {
    try {
        const { nickname, password } = req.body;

        if (!nickname || !password) return res.status(400).json({ error: "Faltan datos" });

        const client = await pool.connect();
        const user = await pool.query("SELECT * FROM users WHERE nickname = $1", [nickname]);

        if (user.rows.length === 0) {
            client.release();
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            client.release();
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, nickname: user.rows[0].nickname },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("Usuario logueado:", user.rows[0]);
        res.status(200).json({ message: "Usuario logueado exitosamente", user: user.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al cerrar sesión" });
    }
}
