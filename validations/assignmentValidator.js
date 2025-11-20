// ecrire toutes les regles de validation pour les assignments ici

import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import  { User, Chantier, Role, Assignment } from "../models/relation.js";


export const assignmentValidationRules = () => {
    return [
        body('userId').isInt().withMessage("L'ID de l'utilisateur doit être un entier"),
        body('chantierId').isInt().withMessage("L'ID du chantier doit être un entier"),
        body('roleId').isInt().withMessage("L'ID du rôle doit être un entier"),
        body('assignedAt').optional().isISO8601().withMessage("La date d'affectation doit être une date valide"),
        body('isActive').optional().isBoolean().withMessage("Le statut actif doit être un booléen"),
    ];
}
export const validateAssignment = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}   

// une autre valisation qui vérifie si l'utilisateur existe déjà et si le chantier et si le role existe
export const checkUserAndChantierExist = async (req, res, next) => {
    const { userId, chantierId, roleId  } = req.body;
    try {   
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur n'existe pas dans le système" });
        }   
        const chantier = await Chantier.findByPk(chantierId);
        if (!chantier) {
            return res.status(404).json({ message: "Chantier n'existe pas dans le système" });
        }
        
        const role = await Chantier.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: "Le role n'existe pas dans le système" });
        }   
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
    


// une autre valisation qui vérifie si un utilisateur est déjà affecté à un chantier 
// avec un rôle spécifique peut être ajoutée ici si nécessaire.
export const checkDuplicateAssignment = async (req, res, next) => {
    const { userId, chantierId, roleId } = req.body;
    try {
        const existingAssignment = await Assignment.findOne({
            where: { userId, chantierId, roleId }
        });
        if (existingAssignment) {
            return res.status(409).json({ message: "Cet utilisateur est déjà affecté à ce chantier avec ce rôle." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

