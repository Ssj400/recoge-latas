const express = require("express");
const {
  getProfile,
  getRanking,
  getHistory,
  deleteHistoryItem,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/ranking", authMiddleware, getRanking);
router.get("/history", authMiddleware, getHistory);
router.delete("/history/:id", authMiddleware, deleteHistoryItem);

module.exports = router;
