import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";


/**
  Table de liaison entre Notification et User
 
  Chaque entrée correspond à un utilisateur qui reçoit une notification.
  Utilisée principalement pour :
    - scope = 'list' (liste d’utilisateurs)
    - scope = 'chantier' (tous les users d’un chantier)
 */

const NotificationRecipient = sequelize.define("NotificationRecipient", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  notificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default NotificationRecipient;
