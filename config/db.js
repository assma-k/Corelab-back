const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connexion à MongoDB réussie');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err);
    process.exit(1);
  }
}

module.exports = connectDB;  