import express from "express";
import { skillGapAnalysis } from "../controllers/analytics/analytics.controller.js";
import { authenticateJWT, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get(
    "/skill-gap",
    authenticateJWT,
    requireAuth,
    skillGapAnalysis
);

export default router;