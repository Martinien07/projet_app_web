import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/connection.js';

// Import des routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js"; //  AJOUT

// Initialisation
const app = express();
const PORT = dotenv.config().parsed.PORT || 8000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Synchronisation DB
database.sync({ alter: true });

// Route test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur notre API!' });
});

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 👇 ROUTES NOTIFICATIONS
app.use("/api/notifications", notificationRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur a démarré sur le port ${PORT}`);
});
