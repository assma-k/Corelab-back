const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const validate = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { importQuiz, updateThreshold, getQuiz } = require('../controllers/quizController');
const { submitQuiz } = require('../controllers/attemptController');
const { quizSchema, thresholdSchema } = require('../validators/quizValidator');

// Routes Étudiant
router.get('/:id', verifyToken, getQuiz);
router.post('/:id/submit', verifyToken, submitQuiz);

// Routes Admin
router.post('/import', verifyToken, isAdmin, upload.single('file'), importQuiz);
router.put('/:id/threshold', verifyToken, isAdmin, validate(thresholdSchema), updateThreshold);

module.exports = router;