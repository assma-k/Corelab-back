const User = require('../models/User');
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

module.exports = { importStudents };