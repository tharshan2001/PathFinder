import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import * as forumCtrl from "../controllers/forum/forumController.js";

const router = express.Router();

// Public routes
router.get("/", forumCtrl.getForums);
router.get("/categories", forumCtrl.getCategories);
router.get("/:id", forumCtrl.getForumById);

// Protected routes
router.post("/", authenticateJWT, forumCtrl.createForum);
router.put("/:id", authenticateJWT, forumCtrl.updateForum);
router.delete("/:id", authenticateJWT, forumCtrl.deleteForum);
router.post("/:id/reply", authenticateJWT, forumCtrl.addReply);
router.post("/:id/vote", authenticateJWT, forumCtrl.voteForum);

export default router;
