const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// Soumettre un Quiz 
async function submitQuiz(req, res) {
    try {
        //on recupere l'id du quiz
        const { id } = req.params;
        //on recupere les reponses
        const { answers } = req.body;
        //on recupere le quiz
        const quiz = await Quiz.findById(id);
        //on compte les reponses correctes
        let correctCount = 0;
        //on parcourt les questions
        quiz.questions.forEach((q, i) => {
            if (q.correctAnswers.includes(answers[i])) correctCount++;
        });
        //on calcule le score
        const score = (correctCount / quiz.questions.length) * 100;
        const passed = score >= quiz.threshold;

        //on enregistre la tentative
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