const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { importStudents, getAllCourses, createCourse, getCourseById, updateCourse, createLesson } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/import-students', verifyToken, isAdmin, upload.single('file'), importStudents);

router.get('/courses', verifyToken, isAdmin, getAllCourses);
router.post('/courses', verifyToken, isAdmin, createCourse);
router.get('/courses/:id', verifyToken, isAdmin, getCourseById);
router.put('/courses/:id', verifyToken, isAdmin, updateCourse);

router.post('/courses/:courseId/lessons', verifyToken, isAdmin, upload.single('file'), createLesson);

module.exports = router;