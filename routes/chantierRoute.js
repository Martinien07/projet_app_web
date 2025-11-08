// routes/chantierRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const chantierController = require('../controllers/chantierController');
const { protect } = require('../middlewares/authMiddleware');

// Creer un nouveau chantier
router.post('/',
    protect,
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('location').notEmpty().withMessage('La localisation est requise'),
    body('startDate').isISO8601().withMessage('La date de début est invalide'),
    body('endDate').isISO8601().withMessage('La date de fin est invalide'),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await chantierController.addChantier(req, res);
    }
);

// Lister tous les chantiers
router.get('/',
    protect,
    async (req, res) => {
        await chantierController.getAllChantiers(req, res);
    }
);

// Recuperer un chantier par ID
router.get('/:id',
    protect,
    param('id').isUUID().withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getChantierById(req, res);
    }
);

// Assigner un utilisateur à un chantier
router.post('/:chantierId/assign-user/:userId',
    protect,
    param('chantierId').isUUID().withMessage('ID de chantier invalide'),
    param('userId').isUUID().withMessage('ID d\'utilisateur invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.assignUserToChantier(req, res);
    }
);

// Retirer un utilisateur d'un chantier
router.delete('/:chantierId/remove-user/:userId',
    protect,
    param('chantierId').isUUID().withMessage('ID de chantier invalide'),
    param('userId').isUUID().withMessage('ID d\'utilisateur invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.removeUserFromChantier(req, res);
    }
);

// Mettre à jour un chantier
router.put('/:id',
    protect,
    param('id').isUUID().withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.updateChantier(req, res);
    }
);

// Supprimer un chantier
router.delete('/:id',
    protect,
    param('id').isUUID().withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.deleteChantier(req, res);
    }
);

// Récupérer tous les utilisateurs assignés à un chantier
router.get('/:chantierId/users',
    protect,
    param('chantierId').isUUID().withMessage('ID de chantier invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getUsersByChantier(req, res);
    }
);

// Marquer un chantier comme terminé
router.post('/:id/mark-completed',
    protect,
    param('id').isUUID().withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.markChantierAsCompleted(req, res);
    }
);

export default router;