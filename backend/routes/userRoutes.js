const express = require('express');
const { getProfile, getRanking } = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/ranking', authMiddleware, getRanking); 

module.exports = router;