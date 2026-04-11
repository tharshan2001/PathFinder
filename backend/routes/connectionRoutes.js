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

router.post("/request", sendConnectionRequest);
router.post("/accept", acceptConnectionRequest);
router.post("/reject", rejectConnectionRequest);
router.post("/remove", removeConnection);
router.get("/connections", getUserConnections);
router.get("/pending", getPendingRequests);

export default router;
