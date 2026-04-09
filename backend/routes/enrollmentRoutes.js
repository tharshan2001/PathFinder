import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  updateProgress,
} from "../controllers/course/enrollmentController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// enroll in a course
router.post("/enroll/:courseId", authenticateJWT, enrollInCourse);

// get enrollments by userId (temporary)
router.get("/user/:userId", authenticateJWT, getMyEnrollments);
router.get("/my", authenticateJWT, getMyEnrollments);

// update progress
router.put("/progress/:enrollmentId", authenticateJWT, updateProgress);

export default router;