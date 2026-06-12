const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');

const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.post('/updatePassword', verifyToken, updatePassword)

module.exports = router;