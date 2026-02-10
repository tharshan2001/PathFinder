
import express from "express";
import {
  getUserById,
  updateProfile,
  deactivateUser,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  addCertification,
  updateCertification,
  deleteCertification,
  getAllExperience,
  getAllEducation,
  getAllProjects,
  getAllCertifications
} from "../controllers/user/userController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();


// All routes below require authentication
router.use(authenticateJWT);


// ---------------- User CRUD ----------------
router.post("/get", getUserById); // userId from token
router.put("/update", updateProfile); // userId from token
router.put("/deactivate", deactivateUser); // userId from token

// ---------------- Experience CRUD ----------------
router.get("/experience/all", getAllExperience);
router.post("/experience/add", addExperience); // userId from token
router.put("/experience/update", updateExperience); // userId from token
router.delete("/experience/delete", deleteExperience); // userId from token

// ---------------- Education CRUD ----------------
router.get("/education/all", getAllEducation);
router.post("/education/add", addEducation); // userId from token
router.put("/education/update", updateEducation); // userId from token
router.delete("/education/delete", deleteEducation); // userId from token

// ---------------- Project CRUD ----------------
router.get("/project/all", getAllProjects);
router.post("/project/add", addProject); // userId from token
router.put("/project/update", updateProject); // userId from token
router.delete("/project/delete", deleteProject); // userId from token

// ---------------- Certification CRUD ----------------
router.get("/certification/all", getAllCertifications);
router.post("/certification/add", addCertification); // userId from token
router.put("/certification/update", updateCertification); // userId from token
router.delete("/certification/delete", deleteCertification); // userId from token

export default router;
