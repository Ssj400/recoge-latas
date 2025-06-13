// =============================================
// File: authMiddleware.js
// Description: Handles authentication middleware to verify JWT tokens.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middleware to check if the user is authenticated.
// It checks for a JWT token in the cookies and verifies it.
// If the token is valid, it attaches the user information to the request object.
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token Inválido" });
  }
};

module.exports = authMiddleware;
