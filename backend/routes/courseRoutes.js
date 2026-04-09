import { Router } from "express";
import {
  getCourses,
  getCourseMetaOptions,
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
import { authenticateJWT, authorizeAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getCourses);
router.get("/meta/options", getCourseMetaOptions);
router.get("/:courseId/feedback", getCourseFeedback);
router.get("/:courseId/feedback/me", authenticateJWT, getMyCourseFeedback);
router.post("/:courseId/feedback", authenticateJWT, createFeedback);
router.put("/:courseId/feedback/:feedbackId", authenticateJWT, updateFeedback);
router.delete("/:courseId/feedback/:feedbackId", authenticateJWT, deleteFeedback);

router.get("/:id", getCourseById);
router.post("/", authenticateJWT, authorizeAdmin, createCourse);
router.put("/:id", authenticateJWT, authorizeAdmin, updateCourse);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteCourse);

export default router;