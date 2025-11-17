import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";

/**
 * Relations SIMPLES ET AUTONOMES pour ton module Notifications
 *
 *  Aucun lien avec le modèle User
 *  Aucun foreign key vers la table users
 *  Compatible avec n'importe quelle structure User de l'équipe
 * Testable immédiatement avec Postman
 * Ne casse pas les autres modules
 */

// 1) Une Notification peut avoir plusieurs destinataires
Notification.hasMany(NotificationRecipient, {
  foreignKey: "notificationId",
  as: "recipients",
});

// 2) Chaque NotificationRecipient appartient à une seule Notification
NotificationRecipient.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});

// Export des modèles (facultatif)
export { Notification, NotificationRecipient };
