//import { User } from "../models/relation.js";

// recupérer tous les utilisateurs
//import User from "../models/User.js";
import  { User, Chantier, Role, Assignment } from "../models/relation.js";
export const getAllUsers = async (req, res) => {

    try {  
        const users = await User.findAll();

        res.status(200).json({ data: users }) 
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


// lors de l'ajout d'un utilisateur, le role par defaut est 'ouvrier' et le status est 'actif'
// la table assignment sera mise à jour pour refléter cette affectation par defaut

//on refait l'ajout de l'utilisateur avec ces valeurs par defaut


export const addUser = async (req, res) => {
    const newUser = req.body;

    try {
        // Création de l'utilisateur
        const user = await User.create({
            ...newUser,
            status: true        // status actif automatiquement
        });

        // Récupération du rôle par défaut
        const defaultRole = await Role.findOne({ where: { id: 2 } });//  correspond à 'ouvrier'

        if (!defaultRole) {
            return res.status(500).json({
                message: "Le rôle 'ouvrier' n'existe pas dans la base de données."
            });
        }

        // Création de l'assignation dans Assignment
        await Assignment.create({
            userId: user.id,
            roleId: defaultRole.id,
            chantierId: newUser.chantierId || null  // si tu veux l’assigner directement à un chantier
        });

        res.status(201).json({
            data: user,
            message: "Utilisateur ajouté et rôle par défaut assigné avec succès."
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};





// recupérer un utilisateur par son id
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        res.status(200).json({ data: user })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//modifier un utilisateur

export const updateUser = async (req, res) => {
   const { id } = req.params;
    const updatedUser = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {

            // Mise à jour sécurisée (pour éviter la modification de champs sensibles)
            const allowedFields = ["name", "email", "phone", "status"];
            const safeData = Object.keys(updatedUser)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updatedData[key] }), {});


            await user.update(safeData);
            res.status(200).json({ data: user, message: "Utilisateur mis a jour avec succes" });
        } else {
            res.status(404).json({ message: "Utilisateur non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//supprimer un utilisateur
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: "Utilisateur supprime avec succes" });
        } else {
            res.status(404).json({ message: "Utilisateur non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}







