const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { importStudents } = require('../controllers/adminController');
const {verifyToken, isAdmin} = require('../middlewares/authMiddleware')

router.post('/import-students', verifyToken, isAdmin, upload.single('file'), importStudents);



module.exports = router;