import Notification from "../models/Notification.js";
import NotificationRecipient from "../models/NotificationRecipient.js";

/**
 * CRÉATION D’UNE NOTIFICATION (AUTONOME)
 * Aucune dépendance à User ou Chantier
 */
export const createNotification = async (req, res) => {
  try {
    const {
      senderId,         // facultatif
      title,
      message,
      scope,            // "user" | "list" | "global"
      level,            // "all" | "private" | "hprivate"
      targetUserId,     // si scope = user
      recipients        // si scope = list ou global
    } = req.body;

    // Vérification minimale
    if (!title || !message || !scope) {
      return res.status(400).json({ message: "title, message et scope sont requis" });
    }

    // Création de la notification
    const notification = await Notification.create({
      senderId: senderId || null,
      title,
      message,
      scope,
      level: level || "all",
      targetUserId: targetUserId || null
    });

    /** GENERATION DES DESTINATAIRES **/
    let usersToNotify = [];

    // Scope: user  un destinataire
    if (scope === "user") {
      if (!targetUserId) {
        return res.status(400).json({
          message: "targetUserId est requis lorsque scope = 'user'"
        });
      }
      usersToNotify.push(targetUserId);
    }

    //  Scope: list  liste d’IDs reçue dans body
    if (scope === "list") {
      if (!Array.isArray(recipients)) {
        return res.status(400).json({
          message: "recipients doit être une liste d'IDs"
        });
      }
      usersToNotify = recipients;
    }

    //  Scope: global → liste d’IDs reçue dans body (tu la gères toi-même)
    if (scope === "global") {
      if (!Array.isArray(recipients)) {
        return res.status(400).json({
          message: "Pour scope = 'global', envoie une liste recipients"
        });
      }
      usersToNotify = recipients;
    }

    // Création des destinataires
    const data = usersToNotify.map((id) => ({
      notificationId: notification.id,
      userId: id
    }));

    await NotificationRecipient.bulkCreate(data);

    return res.status(201).json({
      message: "Notification créée avec succès",
      notification,
      recipients: usersToNotify
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



/**
 * RECUPERER LES NOTIFICATIONS D’UN USER (AUTONOME)
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await NotificationRecipient.findAll({
      where: { userId },
      include: [
        {
          model: Notification,
          as: "notification"
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



/**
 * MARQUER UNE NOTIFICATION COMME LUE
 */
export const markAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    if (!userId || !notificationId) {
      return res.status(400).json({
        message: "userId et notificationId sont obligatoires"
      });
    }

    const record = await NotificationRecipient.findOne({
      where: { userId, notificationId },
    });

    if (!record) {
      return res.status(404).json({
        message: "Notification non trouvée pour cet utilisateur"
      });
    }

    record.isRead = true;
    record.readAt = new Date();
    await record.save();

    return res.json({ message: "Notification marquée comme lue" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
