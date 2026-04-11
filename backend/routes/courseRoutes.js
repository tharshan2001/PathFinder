import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course/courseController.js";
import {
  createFeedback,
  deleteFeedback,
  getCourseFeedback,
  getMyCourseFeedback,
  updateFeedback,
} from "../controllers/course/feedbackController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/:courseId/feedback", getCourseFeedback);
router.get("/:courseId/feedback/me", authenticateJWT, getMyCourseFeedback);
router.post("/:courseId/feedback", authenticateJWT, createFeedback);
router.put("/:courseId/feedback/:feedbackId", authenticateJWT, updateFeedback);
router.delete("/:courseId/feedback/:feedbackId", authenticateJWT, deleteFeedback);

export default router;
