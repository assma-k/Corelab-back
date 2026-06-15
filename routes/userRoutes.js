const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { importStudents } = require('../controllers/userController');

// US #4 - Importation d'étudiants (Admin)
router.post('/import-students', verifyToken, isAdmin, upload.single('file'), importStudents);

module.exports = router;
