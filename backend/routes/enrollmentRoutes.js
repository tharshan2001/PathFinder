import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  updateProgress,
} from "../controllers/course/enrollmentController.js";

const router = express.Router();

// enroll in a course
router.post("/enroll/:courseId", enrollInCourse);

// get enrollments by userId (temporary)
router.get("/user/:userId", getMyEnrollments);

// update progress
router.put("/progress/:enrollmentId", updateProgress);

export default router;