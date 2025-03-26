const pool  = require("./db")
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


app.get("/total", async (req, res) => {
    try {
        const result = await pool.query("SELECT SUM(amount) AS total FROM collects")
        res.json({ total: result.rows[0].total || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error getting total amount of latas"});
    }
    
});

app.post("/sum", async (req, res) => {
    try {
        console.log("📥 Datos recibidos:", req.body);
        const { user_id, amount } = req.body;
        if (!user_id || !amount || amount <= 0) {
            return res.status(400).json({error: "Invalid data"});
        }       

        await pool.query("INSERT INTO collects (user_id, amount) VALUES ($1, $2)", [user_id, amount]);
        console.log("✅ POST exitoso, enviando respuesta...");
        return res.status(200).json({message: "POST exitoso"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error registering collects"});
    }
});

app.listen(3000, () => {
      console.log(`Server running on port 3000`);
});

