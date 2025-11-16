// ecrire toutes les regles de validation pour les utilisateurs ici

import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const userValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Le nom est obligatoire'),
        body('email').isEmail().withMessage("L'email n'est pas valide"),
        body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au moins 12 caractères'),
    ];
}
export const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



