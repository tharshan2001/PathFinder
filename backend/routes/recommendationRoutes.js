import express from "express";
import { getRecommendedJobs } from "../controllers/recommendation/recommendationcontroller.js";
import { authenticateJWT, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/jobs", authenticateJWT, requireAuth, getRecommendedJobs);

export default router;
