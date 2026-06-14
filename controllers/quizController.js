const Quiz = require('../models/Quiz');
const fs = require('fs');

// Importer un Quiz 
async function importQuiz(req, res) {
    if(!req.file) return res.status(400).json({ message: 'Fichier manquant'});
    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const quizData = JSON.parse(fileContent);
        quizData.course = req.body.courseId;
        
        const newQuiz = new Quiz(quizData);
        await newQuiz.save();
        fs.unlinkSync(filePath);
        res.status(201).json({ message: "Quiz importé !", quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'import", error: error.message });
    }
}

// Modifier le seuil 
async function updateThreshold(req, res) {
    try {
        const { id } = req.params;
        const { threshold } = req.body;
        const quiz = await Quiz.findByIdAndUpdate(id, { threshold }, { new: true });
        res.status(200).json({ message: "Seuil mis à jour !", threshold: quiz.threshold });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
}

// Récupérer un Quiz
async function getQuiz(req, res) {
    try {
        const quiz = await Quiz.findById(req.params.id).lean();
        if (!quiz) return res.status(404).json({ message: "Quiz non trouvé" });
        quiz.questions.forEach(q => delete q.correctAnswers);
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
}

module.exports = { importQuiz, updateThreshold, getQuiz };