import User from "./User.js";


//Definition des relations plusieurs a plusieurs entre les modeles
//DUser.belongsToMany(Role, { through: "UserRoles" }) //Un user a un role

//DRole.belongsToMany(User, { through: "UserRoles" }); //Un role appartient a un user

// Relations un vers plusieurs entre Department et User

//DDepartment.hasMany(User)
//DUser.belongsTo(Department)

//Dexport { User, Role, Department };
import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";
import User from "./User.js";

/**
 * Relations pour les notifications
 */

// 1) Une notification est envoyée par un seul user (sender)
Notification.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

// 2) Une notification peut cibler un seul user direct
Notification.belongsTo(User, {
  foreignKey: "targetUserId",
  as: "targetUser",
});

// 3) Une notification peut avoir plusieurs destinataires (pour scope = list ou chantier)
Notification.hasMany(NotificationRecipient, {
  foreignKey: "notificationId",
  as: "recipients",
});

// 4) Chaque destinataire est un User
NotificationRecipient.belongsTo(User, {
  foreignKey: "userId",
  as: "recipient",
});
