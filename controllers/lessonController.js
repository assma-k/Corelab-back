const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Créer/Importer une leçon 
async function createLesson(req, res) {
    try {
        const { title, courseId, htmlContent, order } = req.body;
        // gérer les fichiers médias si envoyés via Multer
        const mediaFiles = req.files ? req.files.map(f => f.path) : [];

        //création de la leçon
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

//Modifier une leçon 
async function updateLesson(req, res) {
    try {
        //on recupere l'id de la leçon
        const { id } = req.params;
        //on met a jour la leçon
        const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLesson) return res.status(404).json({ message: "Leçon non trouvée" });
        res.status(200).json({ message: "Leçon mise à jour !", lesson: updatedLesson });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
    }
}

// Accéder à une leçon 
async function getLesson(req, res) {
    try {
        //on recupere l'id de la leçon
        const { id } = req.params;
        //on recupere la leçon
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

// Récupérer les leçons d'un cours
async function getLessonsByCourse(req, res) {
    try {
        //on recupere l'id du cours
        const { courseId } = req.params;
        //on recupere les leçons du cours
        const lessons = await Lesson.find({ course: courseId }).sort('order');
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons", error: error.message });
    }
}

module.exports = { createLesson, updateLesson, getLesson, getLessonsByCourse };