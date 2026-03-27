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

// ------------------ Save/Bookmark Routes ------------------
router.post("/save/course/:courseId", userCtrl.saveCourse);
router.delete("/save/course/:courseId", userCtrl.unsaveCourse);
router.post("/save/job/:jobId", userCtrl.saveJob);
router.delete("/save/job/:jobId", userCtrl.unsaveJob);
router.get("/saved/courses", userCtrl.getSavedCourses);
router.get("/saved/jobs", userCtrl.getSavedJobs);

// ------------------ Learning Path Routes ------------------
router.post("/enroll/path/:pathId", userCtrl.enrollInPath);
router.put("/progress/path/:pathId", userCtrl.updatePathProgress);
router.get("/enrolled/paths", userCtrl.getEnrolledPaths);

// ------------------ Public Profile (no auth) ------------------
router.get("/public/:userId", userCtrl.getPublicProfile);

export default router;
