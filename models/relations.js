import User from "./User.js";
import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";

// Notification envoyée par un user
Notification.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

// Notification vers un user précis
Notification.belongsTo(User, {
  foreignKey: "targetUserId",
  as: "targetUser",
});

// Notification  plusieurs destinataires
Notification.hasMany(NotificationRecipient, {
  foreignKey: "notificationId",
  as: "recipients",
});

// Destinataire  appartient à un user
NotificationRecipient.belongsTo(User, {
  foreignKey: "userId",
  as: "recipient",
});

// DESTINATAIRE  appartient à UNE notification 
NotificationRecipient.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});
