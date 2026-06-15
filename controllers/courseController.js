const Course = require('../models/Course');

// Créer un cours 
async function createCourse(req, res) {
    try {
        //on recupere les données du cours
        const { title, description } = req.body;
        const coverImage = req.file ? req.file.path : '';
        //création du cours
        const newCourse = new Course({
            title,
            description,
            coverImage,
            createdBy: req.user.id
        });
        await newCourse.save();
        res.status(201).json({ message: "Cours créé avec succès !", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du cours", error: error.message });
    }
}

// Récupérer tous les cours 
async function getAllCourses(req, res) {
    try {
        //on recupere tous les cours
        const courses = await Course.find().populate('createdBy', 'firstName lastName');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des cours", error: error.message });
    }
}

// Récupérer mes cours 
async function getStudentCourses(req, res) {
    try {
        //on recupere les cours de l'etudiant
        const courses = await Course.find({ students: req.user.id });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de vos cours", error: error.message });
    }
}

// Assigner un étudiant 
async function assignStudents(req, res) {
    try {
        //on recupere l'id du cours et de l'etudiant
        const { courseId, studentId } = req.body;
        //on assigne l'etudiant au cours
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { students: studentId } },
            { new: true }
        );
        if (!course) return res.status(404).json({ message: "Cours non trouvé" });
        res.status(200).json({ message: "Étudiant assigné avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'assignation", error: error.message });
    }
}

// Retirer un étudiant 
async function removeStudent(req, res) {
    try {
        //on recupere l'id du cours et de l'etudiant
        const { courseId, studentId } = req.params;
        //on retire l'etudiant du cours
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { students: studentId } },
            { new: true }
        );
        res.status(200).json({ message: "Étudiant retiré du cours." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du retrait", error: error.message });
    }
}

module.exports = { 
    createCourse, 
    getAllCourses, 
    getStudentCourses, 
    assignStudents, 
    removeStudent 
};