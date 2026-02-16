import express from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getUserConnections,
  getPendingRequests
} from "../controllers/user/connectionController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

// Send connection request
router.post("/request", sendConnectionRequest);

// Accept connection request
router.post("/accept", acceptConnectionRequest);

// Reject connection request
router.post("/reject", rejectConnectionRequest);

// Remove connection
router.post("/remove", removeConnection);

// Get all connections for logged-in user
router.get("/connections", getUserConnections);

// Get pending requests for logged-in user
router.get("/pending", getPendingRequests);

export default router;
