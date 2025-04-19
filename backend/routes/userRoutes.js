const express = require("express");
const {
  getProfile,
  getRanking,
  getHistory,
  deleteHistoryItem,
  getUserStats,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/ranking", authMiddleware, getRanking);
router.get("/history", authMiddleware, getHistory);
router.get("/stats", authMiddleware, getUserStats);
router.delete("/history/:id", authMiddleware, deleteHistoryItem);

module.exports = router;
