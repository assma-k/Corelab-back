const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { importStudents } = require('../controllers/adminController');

router.post('/import-students', upload.single('file'), importStudents);

module.exports = router;