const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors()); // Autorise le Front-End déconnecté
app.use(express.json()); // Pour lire le contenu des requêtes JSON

app.get('/', (req, res) => res.send('API CoreLab Opérationnelle'));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));