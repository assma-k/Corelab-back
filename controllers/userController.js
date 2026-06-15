const User = require('../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { sendWelcomeEmail } = require('../utils/emailService');

//importation des étudiants
async function importStudents(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'Veuillez fournir un fichier' });
    }
    try {
        //on recupere le fichier
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
        //on parcourt les lignes
        for (const line of lines) {
            const cleanedLine = line.trim();
            //on ignore les lignes vides
            if (!cleanedLine) continue;
            const [email, firstName, lastName] = cleanedLine.split(',');
            //on ignore la ligne d'en-tête
            if (email === 'email') continue;
            const userExists = await User.findOne({ email });
            //on ignore les étudiants déjà existants
            if (userExists) continue;
            //on hash le mot de passe
            const salt = await bcrypt.genSalt(10);
            //on définit le mot de passe par défaut de l'etudiant 
            const hashedPassword = await bcrypt.hash('CoreLab2026!', salt);
            //on crée le nouvel étudiant
            const newStudent = new User({ email, password: hashedPassword, firstName, lastName, role: 'student' });
            await newStudent.save();
            //envoie du mail de bienvenue
            await sendWelcomeEmail(email, firstName, 'CoreLab2026!');
        }
        //on supprime le fichier
        fs.unlinkSync(filePath);
        res.status(201).json({ message: "Importation des étudiants réussie !" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'importation", error: error.message });
    }
}

module.exports = { importStudents };