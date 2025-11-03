//toutes les routes liees aux utilisateurs
import express from 'express';
import { getAllUsers, addUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validations/userValidator.js';
const router = express.Router();
//Route pour recuperer tous les utilisateurs
router.get('/', getAllUsers);
//Route pour ajouter un utilisateur
router.post('/', userValidationRules(), validateUser, addUser);
//Route pour recuperer un utilisateur par son id
router.get('/:id', getUserById);
//Route pour modifier un utilisateur
router.put('/:id', updateUser);
//Route pour supprimer un utilisateur
router.delete('/:id', deleteUser);


export default router;
