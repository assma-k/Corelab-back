const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { importStudents, getAllCourses, createCourse, getCourseById, updateCourse, createLesson, importQuiz, createCohort, getAllCohorts, addStudentsToCohort, assignCourse, getQuizResults, exportQuizResultsCSV } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/import-students', verifyToken, isAdmin, upload.single('file'), importStudents);

router.get('/courses', verifyToken, isAdmin, getAllCourses);
router.post('/courses', verifyToken, isAdmin, createCourse);
router.get('/courses/:id', verifyToken, isAdmin, getCourseById);
router.put('/courses/:id', verifyToken, isAdmin, updateCourse);

router.post('/courses/:courseId/lessons', verifyToken, isAdmin, upload.single('file'), createLesson);
router.post('/courses/:courseId/quizzes/import', verifyToken, isAdmin, upload.single('file'), importQuiz);
router.post('/cohorts', verifyToken, isAdmin, createCohort);
router.get('/cohorts', verifyToken, isAdmin, getAllCohorts);
router.post('/cohorts/:id/students', verifyToken, isAdmin, addStudentsToCohort);

router.post('/assignments', verifyToken, isAdmin, assignCourse);

router.get('/results', verifyToken, isAdmin, getQuizResults);
router.get('/results/export', verifyToken, isAdmin, exportQuizResultsCSV);

module.exports = router;