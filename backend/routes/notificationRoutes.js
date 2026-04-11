import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import * as notificationCtrl from "../controllers/notification/notificationController.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", notificationCtrl.getNotifications);
router.get("/unread-count", notificationCtrl.getUnreadCount);
router.put("/:notificationId/read", notificationCtrl.markAsRead);
router.put("/read-all", notificationCtrl.markAllAsRead);
router.delete("/:notificationId", notificationCtrl.deleteNotification);

export default router;
