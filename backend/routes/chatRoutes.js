import express from "express";
import { createOrGetChat, sendMessage, getInbox, getMessages } from "../controllers/message/chatController.js";
import { authenticateJWT, requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Create or get a chat
router.post("/chats", authenticateJWT, createOrGetChat);

// Send a message
router.post("/messages", authenticateJWT, sendMessage);

// Get inbox/chat list
router.get("/chats/:userId", authenticateJWT, getInbox);

// Get messages for a specific chat
router.get("/messages/:chatId", authenticateJWT, getMessages);

export default router;
