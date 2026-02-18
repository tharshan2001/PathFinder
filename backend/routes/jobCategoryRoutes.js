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

const router = express.Router();

// ---------------------- Job Category CRUD ----------------------
router.post("/", createJobCategory);
router.get("/", getJobCategories);
router.get("/featured", getFeaturedCategories);
router.get("/popular", getPopularCategories);
router.get("/type/:type", getCategoriesByType);
router.get("/:id", getJobCategoryById);
router.put("/:id", updateJobCategory);
router.put("/:id/job-count", updateCategoryJobCount);
router.delete("/:id", deleteJobCategory);

export default router;
