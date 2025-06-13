// =============================================
// File: monitorRoutes.js
// Description: Handles routes for monitoring the server and database status.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");
const { ping } = require("../controllers/monitorControllers");
const { pingDb } = require("../controllers/monitorControllers");

const router = express.Router();

router.get("/ping", ping);
router.get("/ping-db", pingDb);

module.exports = router;
