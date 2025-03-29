const express = require("express");
const { getLogs, getAvailableNames } = require("../controllers/logController");

const router = express.Router();

router.get("/logs", getLogs);
router.get("/available-names", getAvailableNames);

module.exports = router;
