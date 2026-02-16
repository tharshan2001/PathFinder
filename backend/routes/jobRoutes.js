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

const router = express.Router();

// ---------------------- Job CRUD ----------------------
router.post("/", createJob);
router.get("/", getJobs);
router.get("/featured", getFeaturedJobs);
router.get("/recent", getRecentJobs);
router.get("/statistics", getJobStatistics);
router.get("/search", searchJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
