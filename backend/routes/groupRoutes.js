const express = require("express");

const {
  getGroup,
  getGroupRanking,
} = require("../controllers/groupControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/my-group", authMiddleware, getGroup);
router.get("/ranking", authMiddleware, getGroupRanking);

module.exports = router;
