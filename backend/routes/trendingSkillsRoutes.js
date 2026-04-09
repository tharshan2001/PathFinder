import express from "express";
import {
  upsertTrendingSkill,
  getTrendingSkills,
  getTrendingSkillById,
  getTrendingSkillByName,
  updateTrendingSkill,
  deleteTrendingSkill,
  getSkillsByCategory,
  getSkillsByLocation,
  getRisingSkills,
  getHotSkills,
  getSkillsByExperienceLevel,
  getRemoteFriendlySkills,
  getSkillStatistics,
  updateSkillTrends
} from "../controllers/job/trendingSkillsController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ---------------------- Trending Skills CRUD ----------------------
router.post("/:skill", authenticateJWT, authorizeRoles("admin"), upsertTrendingSkill);
router.get("/", getTrendingSkills);
router.get("/statistics", getSkillStatistics);
router.get("/rising", getRisingSkills);
router.get("/hot", getHotSkills);
router.get("/remote-friendly", getRemoteFriendlySkills);
router.get("/category/:category", getSkillsByCategory);
router.get("/location/:location", getSkillsByLocation);
router.get("/experience/:level", getSkillsByExperienceLevel);
router.get("/name/:skill", getTrendingSkillByName);
router.put("/update-trends", authenticateJWT, authorizeRoles("admin"), updateSkillTrends);
router.get("/:id", getTrendingSkillById);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), updateTrendingSkill);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteTrendingSkill);

export default router;
