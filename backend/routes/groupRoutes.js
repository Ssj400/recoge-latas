// =============================================
// File: groupRoutes.js
// Description: Handles routes for group-related operations such as retrieving group information and rankings.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");

const {
  getGroup,
  getGroupRanking,
  getGroupRankingWeekly,
} = require("../controllers/groupControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/my-group", authMiddleware, getGroup);
router.get("/ranking", authMiddleware, getGroupRanking);
router.get("/ranking-weekly", authMiddleware, getGroupRankingWeekly);

module.exports = router;
