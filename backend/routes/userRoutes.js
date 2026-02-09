import express from "express";
import {
  createUser,
  getUserById,
  updateProfile,
  deactivateUser,
  getAllUsers,
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
  deleteCertification
} from "../controllers/user/userController.js";

const router = express.Router();

// ---------------- User CRUD ----------------
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateProfile);
router.put("/:id/deactivate", deactivateUser); // deactivate instead of delete

// ---------------- Experience CRUD ----------------
router.post("/:id/experience", addExperience);
router.put("/:id/experience/:expId", updateExperience);
router.delete("/:id/experience/:expId", deleteExperience);

// ---------------- Education CRUD ----------------
router.post("/:id/education", addEducation);
router.put("/:id/education/:eduId", updateEducation);
router.delete("/:id/education/:eduId", deleteEducation);

// ---------------- Project CRUD ----------------
router.post("/:id/project", addProject);
router.put("/:id/project/:projectId", updateProject);
router.delete("/:id/project/:projectId", deleteProject);

// ---------------- Certification CRUD ----------------
router.post("/:id/certification", addCertification);
router.put("/:id/certification/:certId", updateCertification);
router.delete("/:id/certification/:certId", deleteCertification);

export default router;
