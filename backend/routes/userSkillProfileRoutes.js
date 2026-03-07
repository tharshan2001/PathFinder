import express from "express";
import { createSkillProfile } from "../controllers/user/userSkillProfileController.js";
import { authenticateJWT, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/create",
    authenticateJWT,
    requireAuth,
    createSkillProfile
);

export default router;