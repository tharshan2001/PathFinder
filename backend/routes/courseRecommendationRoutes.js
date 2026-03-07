import express from "express";
import { authenticateJWT, requireAuth } from "../middleware/auth.js";
import { recommendCoursesForGap } from "../controllers/recommendation/course_recommendation_controller.js";

const router = express.Router();

router.get(
    "/recommended-courses",
    authenticateJWT,
    requireAuth,
    recommendCoursesForGap
);

export default router;