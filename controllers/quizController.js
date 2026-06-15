const Quiz = require('../models/Quiz');
const fs = require('fs');
const csv = require('csv-parser'); // Nouveau

//Importer un Quiz (JSON ou CSV)
async function importQuiz(req, res) {
    if (!req.file) return res.status(400).json({ message: 'Fichier manquant' });
    
    //on recupere le fichier
    const filePath = req.file.path;
    const extension = req.file.originalname.split('.').pop().toLowerCase();

    try {
        //on verifie l'extension du fichier
        let quizData;
        //si c'est du json
        if (extension === 'json') {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            quizData = JSON.parse(fileContent);
            //si c'est du csv
        } else if (extension === 'csv') {
            quizData = { title: "Quiz Importé CSV", questions: [] };
            const results = [];
            
            // On lit le CSV ligne par ligne
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });

            // On transforme les lignes CSV en format Quiz
            quizData.questions = results.map(row => ({
                text: row.question,
                options: row.options.split('|'), // On suppose les options séparées par |
                correctAnswers: row.correctAnswers.split(',').map(Number)
            }));
        } else {
            return res.status(400).json({ message: "Format non supporté (seuls JSON et CSV sont acceptés)" });
        }

        //on ajoute le cours au quiz
        quizData.course = req.body.courseId;
        const newQuiz = new Quiz(quizData);
        await newQuiz.save();
        
        //on supprime le fichier
        fs.unlinkSync(filePath);
        res.status(201).json({ message: `Quiz importé (${extension.toUpperCase()}) !`, quiz: newQuiz });
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ message: "Erreur lors de l'import", error: error.message });
    }
}

// Modifier le seuil de réussite
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