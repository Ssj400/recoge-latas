// =============================================
// File: authRoutes.js
// Description: Handles authentication routes for user registration, login, and logout.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
