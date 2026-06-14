const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/db');

// Routes
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const courseRoutes = require('../routes/courseRoutes');
const lessonRoutes = require('../routes/lessonRoutes');
const quizRoutes = require('../routes/quizRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => res.send('API CoreLab Opérationnelle'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));