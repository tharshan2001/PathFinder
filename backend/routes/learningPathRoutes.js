import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import * as pathCtrl from "../controllers/learningPath/learningPathController.js";

const router = express.Router();

// Public routes
router.get("/", pathCtrl.getLearningPaths);
router.get("/categories", pathCtrl.getCategories);
router.get("/:id", pathCtrl.getLearningPathById);

// Protected routes
router.post("/", authenticateJWT, pathCtrl.createLearningPath);
router.put("/:id", authenticateJWT, pathCtrl.updateLearningPath);
router.delete("/:id", authenticateJWT, pathCtrl.deleteLearningPath);
router.get("/user/enrolled", authenticateJWT, pathCtrl.getMyEnrolledPaths);

export default router;
