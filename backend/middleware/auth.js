import jwt from "jsonwebtoken";
import { isAdminUser } from "../utils/adminAuth.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const COOKIE_NAME = "token";

export const authenticateJWT = (req, res, next) => {
  // Check both cookie and Authorization header
  let token = req.cookies?.[COOKIE_NAME];
  
  // If no cookie, check Authorization header (Bearer token)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!isAdminUser(req.user)) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
