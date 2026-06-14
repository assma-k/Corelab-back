const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Créer/Importer une leçon 
async function createLesson(req, res) {
    try {
        const { title, courseId, htmlContent, order } = req.body;
        // gérer les fichiers médias si envoyés via Multer
        const mediaFiles = req.files ? req.files.map(f => f.path) : [];

        const newLesson = new Lesson({
            title,
            course: courseId,
            htmlContent,
            mediaFiles,
            order
        });
        await newLesson.save();
        res.status(201).json({ message: "Leçon créée avec succès !", lesson: newLesson });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la leçon", error: error.message });
    }
}

// US #8 - Modifier une leçon 
async function updateLesson(req, res) {
    try {
        const { id } = req.params;
        const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLesson) return res.status(404).json({ message: "Leçon non trouvée" });
        res.status(200).json({ message: "Leçon mise à jour !", lesson: updatedLesson });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
    }
}

// US #11 - Accéder à une leçon 
async function getLesson(req, res) {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id).populate('course');
        if (!lesson) return res.status(404).json({ message: "Leçon non trouvée" });

        // Vérification de l'assignation
        const isAssigned = lesson.course.students.includes(req.user.id);
        if (!isAssigned) return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas inscrit à ce cours." });

        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
}

async function getLessonsByCourse(req, res) {
    try {
        const { courseId } = req.params;
        const lessons = await Lesson.find({ course: courseId }).sort('order');
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons", error: error.message });
    }
}

module.exports = { createLesson, updateLesson, getLesson, getLessonsByCourse };