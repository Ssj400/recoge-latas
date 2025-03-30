const express = require("express");
const { ping } = require("../controllers/monitorControllers");

const router = express.Router();

router.get("/ping", ping);

module.exports = router;
