const User = require('../models/User');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
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

module.exports = { importStudents, createLesson };