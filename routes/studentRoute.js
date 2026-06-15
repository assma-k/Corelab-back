const express = require('express');
const router = express.Router();
const { getAssignedCourses, getLesson, completeLesson, submitQuiz } = require('../controllers/studentController');
const { verifyToken, isStudent } = require('../middlewares/authMiddleware');

router.get('/courses', verifyToken, isStudent, getAssignedCourses);
router.get('/courses/:courseId/lessons/:lessonId', verifyToken, isStudent, getLesson);
router.post('/courses/:courseId/lessons/:lessonId/complete', verifyToken, isStudent, completeLesson);
router.post('/quizzes/:quizId/submit', verifyToken, isStudent, submitQuiz);

module.exports = router;
