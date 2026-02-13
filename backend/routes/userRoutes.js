import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

// Controllers
import * as userCtrl from "../controllers/user/userController.js";
import * as experienceCtrl from "../controllers/user/experienceController.js";
import * as educationCtrl from "../controllers/user/educationController.js";
import * as projectCtrl from "../controllers/user/projectController.js";
import * as certificationCtrl from "../controllers/user/certificationController.js";
import * as resumeCtrl from "../controllers/user/resumeController.js";
import { singleResumeUpload } from "../middleware/uploadMiddleware.js";


const router = express.Router();

// ------------------ All routes require authentication ------------------
router.use(authenticateJWT);

// ------------------ User CRUD ------------------
router.post("/get", userCtrl.getUserById); // userId from token
router.put("/update", userCtrl.updateProfile); // userId from token
router.put("/deactivate", userCtrl.deactivateUser); // userId from token

// ------------------ Experience CRUD ------------------
router.get("/experience/all", experienceCtrl.getAllExperience);
router.post("/experience/add", experienceCtrl.addExperience);
router.put("/experience/update", experienceCtrl.updateExperience);
router.delete("/experience/delete", experienceCtrl.deleteExperience);

// ------------------ Education CRUD ------------------
router.get("/education/all", educationCtrl.getAllEducation);
router.post("/education/add", educationCtrl.addEducation);
router.put("/education/update", educationCtrl.updateEducation);
router.delete("/education/delete", educationCtrl.deleteEducation);

// ------------------ Project CRUD ------------------
router.get("/project/all", projectCtrl.getAllProjects);
router.post("/project/add", projectCtrl.addProject);
router.put("/project/update", projectCtrl.updateProject);
router.delete("/project/delete", projectCtrl.deleteProject);

// ------------------ Certification CRUD ------------------
router.get("/certification/all", certificationCtrl.getAllCertifications);
router.post("/certification/add", certificationCtrl.addCertification);
router.put("/certification/update", certificationCtrl.updateCertification);
router.delete("/certification/delete", certificationCtrl.deleteCertification);

// ------------------ Resume / CV CRUD ------------------
router.post("/resume/upload", singleResumeUpload("resume"), resumeCtrl.uploadResume);

// Get all resumes
router.get("/resume/all", resumeCtrl.getAllResumes);

// Delete resume
router.delete("/resume/delete", resumeCtrl.deleteResume);

export default router;
