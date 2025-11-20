import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/connection.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chantierRoutes from './routes/chantierRoute.js';
import incidentRoutes from './routes/incidentRoutes.js';


// console.log("Lancement du serveur...",dotenv.config());

//Definir le serveur
const app = express();
const PORT = dotenv.config().parsed.PORT || 8000;

//Ajouter les middlewares a express
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 
//Creation des tables
database.sync({ alter: true })


//Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur notre API!' });
});

//Route pour les utilisateurs à partir de userRoutes.js
app.use('/api/as', userRoutes);


//Route pour les assignement à partir de assignmentRoutes.js
app.use('/api/assignment', assignmentRoutes);

//Route pour les utilisateurs à partir de userRoutes.js
app.use('/api/users', userRoutes);

//Route pour l'authentification à partir de authRoutes.js
app.use('/api/auth', authRoutes);

//Route pour les actions admin à partir de adminRoutes.js
app.use('/api/admin', adminRoutes);


// Route pour les chantiers à partir de chantierRoutes.js
app.use('/api/chantiers', chantierRoutes);

// Route pour les incidents à partir de incidentRoutes.js
app.use('/api/incidents', incidentRoutes);


//Demarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur a demarre sur le port ${PORT}`);
});