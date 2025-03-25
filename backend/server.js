const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let totalLatas = 0;

app.get("/total", (req, res) => {
    res.json({ total: totalLatas });
});

app.post("/sum", (req, res) =>
{
     const { amount } =  req.body;
     totalLatas += parseInt(amount, 10);
     res.json({ total: totalLatas });
});

app.listen(3000, () => {
      console.log(`Server running on port 3000`);
});

