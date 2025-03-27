require("dotenv").config();

const pool  = require("./db")
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");

app.use(cors({
    origin:"http://localhost:5500",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = process.env.JWT_SECRET

app.post("/register", async (req, res) => {
    try {
        const { name, nickname, password } = req.body;
        console.log(name, nickname, password);
        if (!name || !nickname || !password) return res.status(400).json({ error: "Faltan datos" });

        const client = await pool.connect();
        const userExists = await pool.query("SELECT * FROM USERS WHERE nickname = $1", [nickname]);
        
        if (userExists.rows.length > 0) {
            client.release();
            return res.status(400).json({ error: "El nickname ya está en uso"});
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await pool.query("INSERT INTO users (name, nickname, password) VALUES ($1, $2, $3) RETURNING *", [name, nickname, hashedPassword]);


        const token = jwt.sign(
            { id: newUser.rows[0].id, nickname: newUser.rows[0].nickname },
            SECRET_KEY,
            {expiresIn: "1h"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 10
        })

        client.release();
        res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registrando usuario" });
    }
});

app.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    if (!nickname || !password) return res.status(400).json({ error: "Faltan datos" });
    
    try {
        const client = await pool.connect();
        const result = await pool.query("SELECT * FROM users WHERE nickname = $1", [nickname]);
        
        if (result.rows.length === 0) {
            client.release();
            return res.status(401).json({ error: "Usuario no encontrado" });
    }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            client.release();
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ userId: user.id, nickname: user.nickname}, process.env.JWT_SECRET, { expiresIn: "1h" })
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 10,
            sameSite: "Lax"
        });

        client.release();

        res.json({ message: "Login exitoso", user: { id: user.id, nickname: user.nickname } });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
    
});

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo el perfil" });
    }
    
});

app.get("/total", async (req, res) => {
    try {
        const result = await pool.query("SELECT SUM(amount) AS total FROM collects")
        res.json({ total: result.rows[0].total || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error getting total amount of latas"});
    }
    
});



app.post("/sum", authMiddleware, async (req, res) => {
    try {
        console.log("📥 Datos recibidos:", req.body);
        const { amount } = req.body;
    
        const userId = req.user.userId;

        
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({error: "Invalid data"});
        }       

        await pool.query("INSERT INTO collects (user_id, amount) VALUES ($1, $2)", [userId, amount]);

        await pool.query("UPDATE users SET total_cans = total_cans + $1 WHERE id = $2", [ amount, userId ]);


        console.log("✅ POST exitoso, enviando respuesta...");
        return res.status(200).json({message: "POST exitoso"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error registering collects"});
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada exitosamente." });
});

app.listen(3000, () => {
      console.log(`Server running on port 3000`);
});

