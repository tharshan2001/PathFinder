import express from "express";
import {
  submitApplication,
  getJobApplications,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  addCommunication,
  withdrawApplication,
  deleteApplication,
  getApplicationStatistics,
  getApplicationsByStatus
} from "../controllers/job/jobApplicationController.js";

const router = express.Router();

// ---------------------- Application CRUD ----------------------
router.post("/job/:jobId", submitApplication);
router.get("/job/:jobId", getJobApplications);
router.get("/user/:userId", getUserApplications);
router.get("/statistics", getApplicationStatistics);
router.get("/status/:status", getApplicationsByStatus);
router.get("/:id", getApplicationById);
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/interview", scheduleInterview);
router.post("/:id/communication", addCommunication);
router.put("/:id/withdraw", withdrawApplication);
router.delete("/:id", deleteApplication);

export default router;
