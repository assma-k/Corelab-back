const User = require('../models/User');
const bcrypt = require('bcrypt');

async function register(req, res) {
const { email, password, firstName, lastName } = req.body;
try{
//si email existe
const userExists = await User.findOne({ email });
if (userExists){
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
}
//hach MDP
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
//creation et sauvegarde user
const newUser = new User({ email, password: hashedPassword, firstName, lastName });
await newUser.save();
res.status(201).json({ message: "Utilisateur créé avec succès !", userId: newUser._id });
} catch(error){
    res.status(500).json({ message: "Erreur serveur lors de l'inscription", error: error.message });
}
}

module.exports = { register};