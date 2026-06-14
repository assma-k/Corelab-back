const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// Soumettre un Quiz 
async function submitQuiz(req, res) {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const quiz = await Quiz.findById(id);
        
        let correctCount = 0;
        quiz.questions.forEach((q, i) => {
            if (q.correctAnswers.includes(answers[i])) correctCount++;
        });

        const score = (correctCount / quiz.questions.length) * 100;
        const passed = score >= quiz.threshold;

        const attempt = new Attempt({
            student: req.user.id,
            quiz: id,
            answers,
            score,
            passed
        });
        await attempt.save();
        res.status(201).json({ score, passed, message: passed ? "Félicitations !" : "Seuil non atteint" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la soumission", error: error.message });
    }
}

module.exports = { submitQuiz };