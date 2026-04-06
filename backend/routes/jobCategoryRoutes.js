import express from "express";
import {
  createJobCategory,
  getJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
  getCategoriesByType,
  getFeaturedCategories,
  getPopularCategories,
  updateCategoryJobCount
} from "../controllers/job/jobCategoryController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ---------------------- Job Category CRUD ----------------------
router.post("/", authenticateJWT, authorizeRoles("admin"), createJobCategory);
router.get("/", getJobCategories);
router.get("/featured", getFeaturedCategories);
router.get("/popular", getPopularCategories);
router.get("/type/:type", getCategoriesByType);
router.get("/:id", getJobCategoryById);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), updateJobCategory);
router.put("/:id/job-count", authenticateJWT, authorizeRoles("admin"), updateCategoryJobCount);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteJobCategory);

export default router;
