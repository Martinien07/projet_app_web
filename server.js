import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/connection.js';
import userRoutes from './routes/userRoutes.js';


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
//database.sync({ alter: true })


//Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur notre API!' });
});

//Route pour les utilisateurs à partir de userRoutes.js
app.use('/api/users', userRoutes);



//Demarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur a demarre sur le port ${PORT}`);
});