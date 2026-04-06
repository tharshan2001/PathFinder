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
import {
  authenticateJWT,
  authorizeRoles,
  authorizeSelfOrRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

// ---------------------- Application CRUD ----------------------
router.post("/job/:jobId", authorizeRoles("user", "mentor", "admin"), submitApplication);
router.get("/job/:jobId", authorizeRoles("admin"), getJobApplications);
router.get("/user/:userId", authorizeSelfOrRoles("userId", "admin"), getUserApplications);
router.get("/statistics", getApplicationStatistics);
router.get("/status/:status", authorizeRoles("admin"), getApplicationsByStatus);
router.get("/:id", getApplicationById);
router.put("/:id/status", authorizeRoles("admin"), updateApplicationStatus);
router.put("/:id/interview", authorizeRoles("admin"), scheduleInterview);
router.post("/:id/communication", authorizeRoles("admin"), addCommunication);
router.put("/:id/withdraw", authorizeRoles("user", "mentor", "admin"), withdrawApplication);
router.delete("/:id", authorizeRoles("admin"), deleteApplication);

export default router;
