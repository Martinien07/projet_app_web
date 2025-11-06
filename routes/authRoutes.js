//toutes les routes liees aux utilisateurs
import express from 'express';
import { login } from '../controllers/authController.js';
import { authValidationRules } from '../validations/authValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
//Route pour la connexion
router.post('/login',protect, authValidationRules, login);


export default router;

