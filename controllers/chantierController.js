import Chantier from "../models/relation.js";

// recupérer tous les chantiers
export const getAllChantiers = async (req, res) => {
  try {
    const chantiers = await Chantier.findAll();
    res.status(200).json(chantiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ajouter un chantier
export const addChantier = async (req, res) => {
  const newChantier = req.body;

  try {
    const createdChantier = await Chantier.create(newChantier);
    res.status(201).json({ data: createdChantier, message: "Chantier ajoute avec succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// recupérer un chantier par son id
export const getChantierById = async (req, res) => {
  const { id } = req.params;
    try {
        const chantier = await Chantier.findByPk(id);
        res.status(200).json({ data: chantier })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// modifier un chantier
export const updateChantier = async (req, res) => {
  const { id } = req.params;
  const updatedChantier = req.body;
    try {
        await Chantier.update(updatedChantier, { where: { id } });
        res.status(200).json({ message: "Chantier modifie avec succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// supprimer un chantier
export const deleteChantier = async (req, res) => {
  const { id } = req.params;
    try {
        await Chantier.destroy({ where: { id } });
        res.status(200).json({ message: "Chantier supprime avec succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assigner un utilisateur à un chantier
export const assignUserToChantier = async (req, res) => {
  const { userId, chantierId } = req.params;
    try {
        await Chantier.update({ userId }, { where: { id: chantierId } });
        res.status(200).json({ message: "Utilisateur assigne au chantier avec succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retirer un utilisateur d'un chantier
export const removeUserFromChantier = async (req, res) => {
  const { userId, chantierId } = req.params;
    try {
        const chantier = await Chantier.findByPk(chantierId);
        if (!chantier) {
            return res.status(404).json({ message: "Chantier non trouvé" });
        }
        await Chantier.update({ userId: null }, { where: { id: chantierId } });
        res.status(200).json({ message: "Utilisateur retire du chantier avec succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les utilisateurs assignés à un chantier
export const getUsersByChantier = async (req, res) => {
  const { chantierId } = req.params;
    try {
        const chantier = await Chantier.findByPk(chantierId, {
            include: 'Users' 
        });
        res.status(200).json({ data: chantier.Users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Marquer un chantier comme terminé
export const markChantierAsCompleted = async (req, res) => {
  const { id } = req.params;
    try {
        await Chantier.update({ status: 'terminé' }, { where: { id } });
        res.status(200).json({ message: "Chantier marque comme terminé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
