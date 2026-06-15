const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const validate = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { createLesson, updateLesson, getLesson, getLessonsByCourse } = require('../controllers/lessonController');

// Routes Étudiant
router.get('/:id', verifyToken, getLesson);
router.get('/course/:courseId', verifyToken, getLessonsByCourse);

// Routes Admin
router.post('/', verifyToken, isAdmin, upload.array('mediaFiles', 5), createLesson);
router.put('/:id', verifyToken, isAdmin, updateLesson);

module.exports = router;