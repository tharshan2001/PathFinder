import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

import * as userCtrl from "../controllers/user/userController.js";
import * as experienceCtrl from "../controllers/user/experienceController.js";
import * as educationCtrl from "../controllers/user/educationController.js";
import * as projectCtrl from "../controllers/user/projectController.js";
import * as certificationCtrl from "../controllers/user/certificationController.js";
import * as resumeCtrl from "../controllers/user/resumeController.js";
import * as skillCtrl from "../controllers/user/skillController.js";
import { singleResumeUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/get", userCtrl.getUserById);
router.put("/update", userCtrl.updateProfile);
router.put("/deactivate", userCtrl.deactivateUser);

router.get("/experience/all", experienceCtrl.getAllExperience);
router.post("/experience/add", experienceCtrl.addExperience);
router.put("/experience/update", experienceCtrl.updateExperience);
router.delete("/experience/delete", experienceCtrl.deleteExperience);

router.get("/education/all", educationCtrl.getAllEducation);
router.post("/education/add", educationCtrl.addEducation);
router.put("/education/update", educationCtrl.updateEducation);
router.delete("/education/delete", educationCtrl.deleteEducation);

router.get("/project/all", projectCtrl.getAllProjects);
router.post("/project/add", projectCtrl.addProject);
router.put("/project/update", projectCtrl.updateProject);
router.delete("/project/delete", projectCtrl.deleteProject);

router.get("/certification/all", certificationCtrl.getAllCertifications);
router.post("/certification/add", certificationCtrl.addCertification);
router.put("/certification/update", certificationCtrl.updateCertification);
router.delete("/certification/delete", certificationCtrl.deleteCertification);

router.get("/skill/all", skillCtrl.getAllSkills);
router.post("/skill/add", skillCtrl.addSkill);
router.delete("/skill/delete", skillCtrl.deleteSkill);

router.post("/resume/upload", singleResumeUpload("resume"), resumeCtrl.uploadResume);
router.get("/resume/all", resumeCtrl.getAllResumes);
router.delete("/resume/delete", resumeCtrl.deleteResume);

router.post("/save/course/:courseId", userCtrl.saveCourse);
router.delete("/save/course/:courseId", userCtrl.unsaveCourse);
router.post("/save/job/:jobId", userCtrl.saveJob);
router.delete("/save/job/:jobId", userCtrl.unsaveJob);
router.get("/saved/courses", userCtrl.getSavedCourses);
router.get("/saved/jobs", userCtrl.getSavedJobs);

router.post("/enroll/path/:pathId", userCtrl.enrollInPath);
router.put("/progress/path/:pathId", userCtrl.updatePathProgress);
router.get("/enrolled/paths", userCtrl.getEnrolledPaths);

router.get("/public/:userId", userCtrl.getPublicProfile);
router.get("/suggestions", userCtrl.getUserSuggestions);

export default router;
