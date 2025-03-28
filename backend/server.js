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



app.post("/register", async (req, res) => {
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
            return res.status(400).json({
                error: "El nombre ya fue usado o no existe"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);


    
        const updatedUser = await pool.query("UPDATE users SET nickname = $1, password = $2 WHERE id = $3 RETURNING *", [nickname, hashedPassword, availableUser.rows[0].id]);

        await pool.query("COMMIT");
        console.log("Nuevo usuario registrado:", updatedUser.rows[0]);
        
        const token = jwt.sign(
            { id: updatedUser.rows[0].id, nickname: updatedUser.rows[0].nickname },
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax"
        })


        res.status(201).json({ message: "Usuario registrado exitosamente", user: updatedUser.rows[0]});
        client.release();
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

        const token = jwt.sign({ userId: user.id, nickname: user.nickname}, process.env.JWT_SECRET, { expiresIn: "24h" })
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax"
        });

        client.release();

        res.json({ message: "Login exitoso", user: { id: user.id, nickname: user.nickname } });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
    
});

app.get("/available-names", async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await pool.query("SELECT name FROM users WHERE nickname IS NULL");

        client.release();

        res.json(result.rows.map(row => row.name));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo nombres disponibles" })
    }
})

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
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

app.get("/ranking", async (req, res) => {
    try {
        const client = await pool.connect();
        const ranking = await client.query("SELECT name, nickname, total_cans FROM users ORDER BY total_cans DESC LIMIT 10");
        client.release();

        res.status(200).json(ranking.rows);
    } catch (error) {
        req.status(500).json({ error: "Error obteniendo el ranking" });
    }
})

app.post("/sum", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("📥 Datos recibidos:", req.body, "userId:", userId);
        const { amount } = req.body;
    
        

        
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

