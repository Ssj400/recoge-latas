const express = require("express");
const { addCollect,  getTotal } = require("../controllers/collectController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/sum", authMiddleware, addCollect);   
router.get("/total", getTotal);

module.exports = router;