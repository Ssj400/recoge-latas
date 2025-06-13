// =============================================
// File: collectRoutes.js
// Description: Handles routes for collecting and retrieving total contributions.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");
const { addCollect, getTotal } = require("../controllers/collectController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/sum", authMiddleware, addCollect);
router.get("/total", getTotal);

module.exports = router;
