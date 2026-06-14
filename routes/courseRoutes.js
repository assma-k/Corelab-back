const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const validate = require('../middlewares/validate'); // Import du middleware
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { courseSchema, assignSchema } = require('../validators/courseValidator'); // Import des schémas
const { 
    createCourse, 
    getAllCourses, 
    getStudentCourses, 
    assignStudents, 
    removeStudent 
} = require('../controllers/courseController');

// Routes Étudiant
router.get('/me', verifyToken, getStudentCourses);

// Routes Admin
router.post('/', verifyToken, isAdmin, upload.single('coverImage'), validate(courseSchema), createCourse);
router.get('/', verifyToken, isAdmin, getAllCourses);
router.post('/assign', verifyToken, isAdmin, validate(assignSchema), assignStudents);
router.delete('/:courseId/assign/:studentId', verifyToken, isAdmin, removeStudent);

module.exports = router;