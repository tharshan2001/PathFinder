import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getFeaturedJobs,
  getRecentJobs,
  getJobStatistics,
  searchJobs
} from "../controllers/job/jobController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateJWT, authorizeRoles("admin"), createJob);
router.get("/", getJobs);
router.get("/featured", getFeaturedJobs);
router.get("/recent", getRecentJobs);
router.get("/statistics", getJobStatistics);
router.get("/search", searchJobs);
router.get("/:id", getJobById);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), updateJob);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteJob);

export default router;
