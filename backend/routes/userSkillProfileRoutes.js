import express from "express";
import {
    createSkillProfile,
    getMySkillProfile,
    updateSkillProfile,
    deleteSkillProfile,
    addSkill,
    updateSkill,
    deleteSkill
} from "../controllers/user/userSkillProfileController.js";

import { authenticateJWT, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateJWT, requireAuth, createSkillProfile);
router.get("/", authenticateJWT, requireAuth, getMySkillProfile);
router.put("/", authenticateJWT, requireAuth, updateSkillProfile);
router.delete("/", authenticateJWT, requireAuth, deleteSkillProfile);

router.post("/skill", authenticateJWT, requireAuth, addSkill);
router.put("/skill/:skillName", authenticateJWT, requireAuth, updateSkill);
router.delete("/skill/:skillName", authenticateJWT, requireAuth, deleteSkill);

export default router;