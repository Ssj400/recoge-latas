// =============================================
// File: logRoutes.js
// Description: Handles routes for retrieving logs and available names.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");
const { getLogs, getAvailableNames } = require("../controllers/logController");

const router = express.Router();

router.get("/logs", getLogs);
router.get("/available-names", getAvailableNames);

module.exports = router;
