const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function importStudents(req, res) {
    if(!req.file) {
        return res.status(400).json({ message: 'Veuillez fournir un fichier'});
    }
    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
        for(const line of lines){
            const cleanedLine = line.trim();
            //si ligne vide passe a la suite
            if (!cleanedLine) continue;
            //destructure par ,
            const [email, firstName, lastName] = cleanedLine.split(',');
            //ignore la ligen d'entete 
            if (email === 'email') continue;
            //verif existance student
            const userExists = await User.findOne({ email });
            if (userExists) continue;
            //genere MDP default
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('CoreLab2026!', salt);
            //cree et save student
            const newStudent = new User({ email, password: hashedPassword, firstName, lastName, role: 'student' });
            await newStudent.save();
        }
        fs.unlinkSync(filePath);
        res.status(201).json({ message: "Importation des étudiants réussie avec succès !" });

    }catch (error){
        res.status(500).json({ message: "Erreur lors de l'importation", error: error.message});
    }
}
async function getAllCourses(req, res) {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des cours", error: error.message });
    }
}

async function createCourse(req, res) {
    const { title, description } = req.body;
    try {
        const newCourse = new Course({ title, description });
        await newCourse.save();
        res.status(201).json({ message: "Cours créé avec succès !", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du cours", error: error.message });
    }
}

async function getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Cours introuvable" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du cours", error: error.message });
    }
}

async function updateCourse(req, res) {
    const { title, description } = req.body;
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true, runValidators: true }
        );
        if (!updatedCourse) return res.status(404).json({ message: "Cours introuvable" });
        res.status(200).json({ message: "Cours mis à jour avec succès !", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du cours", error: error.message });
    }
}

async function createLesson(req, res) {
    const courseId = req.params.courseId;
    const { title } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ message: "Veuillez fournir un fichier HTML pour la leçon." });
    }
    
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Cours introuvable." });
        }
        
        const contentUrl = req.file.path;
        
        const newLesson = new Lesson({
            title: title || req.file.originalname,
            contentUrl,
            courseId
        });
        
        await newLesson.save();
        
        course.lessons.push(newLesson._id);
        await course.save();
        
        res.status(201).json({ message: "Leçon ajoutée avec succès !", lesson: newLesson });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la leçon.", error: error.message });
    }
}

async function importQuiz(req, res) {
    const courseId = req.params.courseId;
    
    if (!req.file) {
        return res.status(400).json({ message: "Veuillez fournir un fichier JSON pour le quiz." });
    }
    
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Cours introuvable." });
        }
        
        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        const quizData = JSON.parse(fileContent);
        
        if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Format du JSON invalide. 'title' et 'questions' sont requis." });
        }
        
        const newQuiz = new Quiz({
            title: quizData.title,
            passingThreshold: quizData.passingThreshold || 50,
            courseId: courseId,
            questions: quizData.questions
        });
        
        await newQuiz.save();
        
        course.quizzes.push(newQuiz._id);
        await course.save();
        
        fs.unlinkSync(req.file.path);
        
        res.status(201).json({ message: "Quiz importé avec succès !", quiz: newQuiz });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Erreur lors de l'import du quiz.", error: error.message });
    }
}

module.exports = { importStudents, getAllCourses, createCourse, getCourseById, updateCourse, createLesson, importQuiz };
