const express = require("express");
const { ping } = require("../controllers/monitorControllers");
const { pingDb } = require("../controllers/monitorControllers");

const router = express.Router();

router.get("/ping", ping);
router.get("/ping-db", pingDb);

module.exports = router;
