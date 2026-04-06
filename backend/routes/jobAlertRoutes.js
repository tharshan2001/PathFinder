import express from "express";
import {
  createJobAlert,
  getUserJobAlerts,
  getJobAlertById,
  updateJobAlert,
  deleteJobAlert,
  toggleJobAlert,
  findMatchingJobs,
  processAllAlerts,
  getAlertStatistics
} from "../controllers/job/jobAlertController.js";
import {
  authenticateJWT,
  authorizeRoles,
  authorizeSelfOrRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

// ---------------------- Job Alert CRUD ----------------------
router.post("/", createJobAlert);
router.get("/statistics", getAlertStatistics);
router.get("/process", authorizeRoles("admin"), processAllAlerts);
router.get("/user/:userId", authorizeSelfOrRoles("userId", "admin"), getUserJobAlerts);
router.get("/:id", getJobAlertById);
router.get("/:id/matches", findMatchingJobs);
router.put("/:id", updateJobAlert);
router.put("/:id/toggle", toggleJobAlert);
router.delete("/:id", deleteJobAlert);

export default router;
