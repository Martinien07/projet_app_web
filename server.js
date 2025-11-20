import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import database from './config/connection.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chantierRoutes from './routes/chantierRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import './models/Inspection.js';
import './models/Notification.js';
import './models/NotificationRecipient.js';


// console.log("Lancement du serveur...",dotenv.config());

//Definir le serveur
const app = express();
const PORT = process.env.PORT || 8000;

//Ajouter les middlewares a express
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur notre API!' });
});

//Route pour les utilisateurs à partir de userRoutes.js
// app.use('/api/as', userRoutes);


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


// Creation des tables et demarrage du serveur apres synchronisation
database.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized (tables created/updated)');
        app.listen(PORT, () => {
            console.log(`Le serveur a demarre sur le port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erreur lors de la synchronisation de la base de donnees:', err);
        process.exit(1);
    });
