// server.js
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/connection.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// ####################################################################   NOUVELLE LIGNE
import inspectionRoutes from './routes/inspectionRoutes.js';

const app = express();
const PORT = dotenv.config().parsed.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Création / MAJ des tables
database.sync({ alter: true });

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur notre API!' });
});

// Routes existantes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ##############################################################    NOUVELLE ROUTE POUR LES INSPECTIONS
app.use('/api/inspections', inspectionRoutes);``

app.listen(PORT, () => {
  console.log(`Le serveur a demarre sur le port ${PORT}`);
});
