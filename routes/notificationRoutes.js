import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Créer une notification
router.post("/create", createNotification);

// Récupérer les notifications d’un utilisateur
router.get("/user/:userId", getUserNotifications);

// Marquer une notification comme lue
router.post("/read", markAsRead);

export default router;
