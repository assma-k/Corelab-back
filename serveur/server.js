const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Autorise le Front-End déconnecté
app.use(express.json()); // Pour lire le contenu des requêtes JSON

app.get('/', (req, res) => res.send('API CoreLab Opérationnelle'));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));