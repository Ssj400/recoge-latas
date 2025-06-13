// =============================================
// File: server.js
// Description: Main file of the backend itself.
// Handles API requests and manages the express application with the routes folders.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

//Load environment variables and import necessary modules
require("dotenv").config();

//Create the express application
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// =========================== Route Imports ===========================
// Each route file is responsible for a specific part of the application, such as authentication, user management, collection handling, logging, monitoring, and group management.
// The server uses JSON for request bodies and cookie parsing for handling cookies in requests.

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const collectRoutes = require("./routes/collectRoutes");
const logRoutes = require("./routes/logRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const groupRoutes = require("./routes/groupRoutes");

// ==================== Middleware Setup ====================

// Configure CORS policy depending on environment:
// In production, only allow the deployed frontend; in development, allow localhost.
app.use(
  cors(
    process.env.NODE_ENV == "production"
      ? {
          origin: "https://recoge-latas-uc2v.onrender.com",
          credentials: true,
        }
      : {
          origin: "http://localhost:5500",
          credentials: true,
        }
  )
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collects", collectRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/groups", groupRoutes);

// ==================== Server Start ====================
// Start the server on port 8080 and log confirmation
app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});
