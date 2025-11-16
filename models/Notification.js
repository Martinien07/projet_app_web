import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

/**
 Modèle Notification
 Une notification peut être destinée :
   - à un seul utilisateur (scope = 'user')
   - à tous les utilisateurs d’un chantier (scope = 'chantier')
   - à une liste spécifique d’utilisateurs (scope = 'list')
   - à toute la plateforme (scope = 'global')
 */

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Celui qui envoie la notification
  },

  chantierId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Seulement utilisé si scope = chantier
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  scope: {
    type: DataTypes.ENUM("user", "chantier", "global", "list"),
    allowNull: false,
  },

  level: {
    type: DataTypes.ENUM("all", "private", "hprivate"),
    allowNull: false,
  },

  targetUserId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Seulement si scope = user
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Notification;
