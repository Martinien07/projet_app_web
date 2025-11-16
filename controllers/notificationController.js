import Notification from "../models/Notification.js";
import NotificationRecipient from "../models/NotificationRecipient.js";
import User from "../models/User.js";

/**
 * Création d’une notification + gestion automatique des destinataires
 */
export const createNotification = async (req, res) => {
  try {
    const {
      senderId,
      chantierId,
      title,
      message,
      scope,
      level,
      targetUserId,
      recipients // liste d'IDs users si scope = "list"
    } = req.body;

    // 1) Création de la notification
    const notification = await Notification.create({
      senderId,
      chantierId,
      title,
      message,
      scope,
      level,
      targetUserId
    });

    // 2) Génération des destinataires selon le scope
    let usersToNotify = [];

    if (scope === "user") {
      if (!targetUserId) {
        return res.status(400).json({ message: "targetUserId est requis pour une notification utilisateur" });
      }
      usersToNotify.push(targetUserId);
    }

    if (scope === "list") {
      if (!recipients || !Array.isArray(recipients)) {
        return res.status(400).json({ message: "recipients doit être une liste d'IDs" });
      }
      usersToNotify = recipients;
    }

    if (scope === "chantier") {
      if (!chantierId) {
        return res.status(400).json({ message: "chantierId requis pour notifier un chantier" });
      }
      const chantierUsers = await User.findAll({ where: { chantierId } });
      usersToNotify = chantierUsers.map(u => u.id);
    }

    if (scope === "global") {
      const allUsers = await User.findAll();
      usersToNotify = allUsers.map(u => u.id);
    }

    // 3) Ajouter les destinataires dans NotificationRecipient
    const recipientRecords = usersToNotify.map(userId => ({
      notificationId: notification.id,
      userId
    }));

    await NotificationRecipient.bulkCreate(recipientRecords);

    return res.status(201).json({
      message: "Notification envoyée avec succès",
      notification
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

/**
 * Récupérer toutes les notifications d’un user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await NotificationRecipient.findAll({
      where: { userId },
      include: [
        {
          model: Notification,
          as: "notification",
          include: [{ model: User, as: "sender" }]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: "Erreur", error });
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const record = await NotificationRecipient.findOne({
      where: { userId, notificationId }
    });

    if (!record) {
      return res.status(404).json({ message: "Notification non trouvée pour cet utilisateur" });
    }

    record.isRead = true;
    record.readAt = new Date();
    await record.save();

    return res.json({ message: "Notification marquée comme lue" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
