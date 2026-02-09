import express from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  removeConnection,
  getUserConnections,
  getPendingRequests,
  rejectConnectionRequest
} from "../controllers/user/connectionController.js";

const router = express.Router();

// Send request
router.post("/request", sendConnectionRequest);

// Accept request
router.put("/:connectionId/accept", acceptConnectionRequest);

// Remove connection
router.delete("/:connectionId", removeConnection);

// Get connections
router.get("/user/:userId", getUserConnections);

// Get pending requests
router.get("/pending/:userId", getPendingRequests);


// Reject request
router.put("/:connectionId/reject", rejectConnectionRequest);

export default router;
