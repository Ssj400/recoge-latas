// =============================================
// File: userRoutes.js
// Description: Handles user-related routes for profile, ranking, history, and statistics.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

const express = require("express");
const {
  getProfile,
  getRanking,
  getHistory,
  deleteHistoryItem,
  getUserStats,
  getWeeklyRanking,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/ranking", authMiddleware, getRanking);
router.get("/history", authMiddleware, getHistory);
router.get("/stats", authMiddleware, getUserStats);
router.delete("/history/:id", authMiddleware, deleteHistoryItem);
router.get("/ranking-weekly", authMiddleware, getWeeklyRanking);

module.exports = router;
