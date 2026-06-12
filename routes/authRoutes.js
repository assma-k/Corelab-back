const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const {regist, log, updatePass} = require('../validators/authValidator');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', validate(regist), register);

router.post('/login', validate(log), login);

router.post('/updatePassword', verifyToken, validate(updatePass), updatePassword)

module.exports = router;