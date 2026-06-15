const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Enregistrer un nouvel utilisateur 
async function register(req, res) {
    const { email, password, firstName, lastName } = req.body;
    try {
        //si email existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        //hach MDP
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //creation et sauvegarde user
        const newUser = new User({ email, password: hashedPassword, firstName, lastName });
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de l'inscription", error: error.message });
    }
}

// Se connecter 
async function login(req, res) {
    const { email, password } = req.body;
    try {
        //si email existe
        const user = await User.findOne({ email });
        if (!user) { return res.status(401).json({ message: "Identifiants incorrects" }); }
        //comparaison MDP
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: "Identifiants incorrects" }); }
        //creation token de co 
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: "Connexion réussie !", token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role, firstLogin: user.firstLogin } });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion", error: error.message });

    }
}

// Mettre à jour le mot de passe 
async function updatePassword(req, res) {
    //on recupere l'id de l'utilisateur
    const id = req.user.id;
    //on recupere le nouveau mdp
    const { newPassword } = req.body;
    try {
        //on recupere l'utilisateur
        const user = await User.findById(id);
        //hachage du nouveau mdp
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        //mise a jour du mdp
        user.password = hashedNewPassword;
        user.firstLogin = false;
        await user.save();
        res.status(200).json({ message: "Mot de passe mis à jour avec succès. Première connexion validée !" });
    } catch (error) {
        res.status(500).json({ message: "Mot de passe non mis à jour." });
    }
}

module.exports = { register, login, updatePassword };