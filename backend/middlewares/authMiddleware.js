require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Acceso denegado"});

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Token Inválido" });
    }
}

module.exports = authMiddleware;