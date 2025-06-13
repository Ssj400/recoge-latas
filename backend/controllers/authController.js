// =============================================
// File: authController.js
// Description: Handles user authentication, including registration, login, and logout.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    //Get the user data from the request body
    const { name, nickname, password } = req.body;

    // Check if the request body contains the required fields
    if (!name || !nickname || !password)
      return res.status(400).json({ error: "Faltan datos" });

    //Connect to the database
    const client = await pool.connect();

    //Search for an existing user with the same nickname
    const userExists = await pool.query(
      "SELECT * FROM users WHERE nickname = $1",
      [nickname]
    );

    // If a user with the same nickname exists, return an error
    if (userExists.rows.length > 0) {
      client.release();
      return res.status(400).json({ error: "El nickname ya está en uso" });
    }

    // Check if the name is available (not already used)
    const availableUser = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND nickname IS NULL",
      [name]
    );

    // If the user is not available, return an error
    if (availableUser.rows.length === 0) {
      client.release();
      return res
        .status(400)
        .json({ error: "El nombre ya fue usado o no existe" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //Update the user's nickname and password in the database
    const updatedUser = await pool.query(
      "UPDATE users SET nickname = $1, password = $2 WHERE id = $3 RETURNING *",
      [nickname, hashedPassword, availableUser.rows[0].id]
    );

    await pool.query("COMMIT");
    client.release();

    console.log("Nuevo usuario registrado:", updatedUser.rows[0]);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    //Get the user data from the request body
    const { nickname, password } = req.body;

    // Check if the request body contains the required fields. If not, return an error
    if (!nickname || !password)
      return res.status(400).json({ error: "Faltan datos" });

    //Connect to the database and check if the user exists
    const client = await pool.connect();
    const user = await pool.query("SELECT * FROM users WHERE nickname = $1", [
      nickname,
    ]);

    // If the user does not exist, return an error
    if (user.rows.length === 0) {
      client.release();
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      client.release();
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // If the password matches, create a JWT token with the user's ID and nickname
    const token = jwt.sign(
      { userId: user.rows[0].id, nickname: user.rows[0].nickname },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set the token as a cookie in the response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    client.release();
    console.log("Usuario logueado:", user.rows[0]);
    res
      .status(200)
      .json({ message: "Usuario logueado exitosamente", user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Logout the user by clearing the token cookie
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
