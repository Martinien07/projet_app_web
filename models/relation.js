import User from "./User.js";
import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";

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

// 3) Une notification peut avoir plusieurs destinataires
Notification.hasMany(NotificationRecipient, {
  foreignKey: "notificationId",
  as: "recipients",
});

// 4) Chaque destinataire est un User
NotificationRecipient.belongsTo(User, {
  foreignKey: "userId",
  as: "recipient",
});

export { User, Notification, NotificationRecipient };
