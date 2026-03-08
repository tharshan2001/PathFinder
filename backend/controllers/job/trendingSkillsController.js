import TrendingSkills from "../../models/job/TrendingSkills.js";

// ---------------------- Trending Skills CRUD ----------------------

// Create/update trending skill
export const upsertTrendingSkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const skillData = { ...req.body, skill };

    const trendingSkill = await TrendingSkills.findOneAndUpdate(
      { skill },
      skillData,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: "Trending skill updated successfully", trendingSkill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all trending skills
export const getTrendingSkills = async (req, res) => {
  try {
    const { 
      limit = 20, 
      category, 
      skillType, 
      location,
      minDemandScore = 0 
    } = req.query;

    const query = { demandScore: { $gte: parseInt(minDemandScore) } };
    
    if (category) query.category = category;
    if (skillType) query.skillType = skillType;
    if (location) query["topLocations.location"] = location;

    const skills = await TrendingSkills.find(query)
      .sort({ demandScore: -1, growthRate: -1 })
      .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get trending skill by ID
export const getTrendingSkillById = async (req, res) => {
  try {
    const skill = await TrendingSkills.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Trending skill not found" });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get trending skill by name
export const getTrendingSkillByName = async (req, res) => {
  try {
    const { skill } = req.params;
    
    const trendingSkill = await TrendingSkills.findOne({ skill });

    if (!trendingSkill) {
      return res.status(404).json({ message: "Trending skill not found" });
    }

    res.json(trendingSkill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update trending skill
export const updateTrendingSkill = async (req, res) => {
  try {
    const skill = await TrendingSkills.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: "Trending skill not found" });
    }

    res.json({ message: "Trending skill updated successfully", skill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete trending skill
export const deleteTrendingSkill = async (req, res) => {
  try {
    const skill = await TrendingSkills.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Trending skill not found" });
    }

    res.json({ message: "Trending skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Skill Analytics ----------------------

// Get skills by category
export const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const skills = await TrendingSkills.find({ 
      category,
      demandScore: { $gt: 0 }
    })
    .sort({ demandScore: -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get skills by location
export const getSkillsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10 } = req.query;

    const skills = await TrendingSkills.find({
      "topLocations.location": location
    })
    .sort({ "topLocations.demandScore": -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get rising skills (high growth rate)
export const getRisingSkills = async (req, res) => {
  try {
    const { limit = 10, minGrowthRate = 5 } = req.query;

    const skills = await TrendingSkills.find({
      growthRate: { $gte: parseFloat(minGrowthRate) }
    })
    .sort({ growthRate: -1, demandScore: -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get hot skills (high demand and growth)
export const getHotSkills = async (req, res) => {
  try {
    const { limit = 10, minDemandScore = 70, minGrowthRate = 10 } = req.query;

    const skills = await TrendingSkills.find({
      demandScore: { $gte: parseInt(minDemandScore) },
      growthRate: { $gte: parseFloat(minGrowthRate) }
    })
    .sort({ demandScore: -1, growthRate: -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get skills by experience level demand
export const getSkillsByExperienceLevel = async (req, res) => {
  try {
    const { level } = req.params; // entry, mid, senior, lead
    const { limit = 10 } = req.query;

    const skills = await TrendingSkills.find({
      [`experienceLevelDemand.${level}`]: { $gt: 0 }
    })
    .sort({ [`experienceLevelDemand.${level}`]: -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get remote-friendly skills
export const getRemoteFriendlySkills = async (req, res) => {
  try {
    const { limit = 10, minRemoteScore = 50 } = req.query;

    const skills = await TrendingSkills.find({
      remoteDemandScore: { $gte: parseInt(minRemoteScore) }
    })
    .sort({ remoteDemandScore: -1, demandScore: -1 })
    .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get skill statistics
export const getSkillStatistics = async (req, res) => {
  try {
    const stats = await TrendingSkills.aggregate([
      {
        $group: {
          _id: null,
          totalSkills: { $sum: 1 },
          avgDemandScore: { $avg: "$demandScore" },
          avgGrowthRate: { $avg: "$growthRate" },
          avgJobCount: { $avg: "$jobCount" },
          avgSalary: { $avg: "$averageSalary" },
          hotSkillsCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $gte: ["$demandScore", 70] },
                  { $gte: ["$growthRate", 10] }
                ]},
                1,
                0
              ]
            }
          },
          risingSkillsCount: {
            $sum: {
              $cond: [{ $gte: ["$growthRate", 5] }, 1, 0]
            }
          }
        }
      }
    ]);

    const skillsByCategory = await TrendingSkills.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgDemandScore: { $avg: "$demandScore" },
          avgGrowthRate: { $avg: "$growthRate" }
        }
      },
      { $sort: { avgDemandScore: -1 } }
    ]);

    const skillsByType = await TrendingSkills.aggregate([
      {
        $group: {
          _id: "$skillType",
          count: { $sum: 1 },
          avgDemandScore: { $avg: "$demandScore" },
          avgGrowthRate: { $avg: "$growthRate" }
        }
      }
    ]);

    const topGrowthSkills = await TrendingSkills.find()
      .sort({ growthRate: -1 })
      .limit(5)
      .select("skill growthRate demandScore");

    const topDemandSkills = await TrendingSkills.find()
      .sort({ demandScore: -1 })
      .limit(5)
      .select("skill demandScore growthRate");

    res.json({
      overview: stats[0] || {},
      byCategory: skillsByCategory,
      byType: skillsByType,
      topGrowth: topGrowthSkills,
      topDemand: topDemandSkills
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update skill trends (for cron job)
export const updateSkillTrends = async (req, res) => {
  try {
    // This would typically be called by a scheduled job
    // For now, we'll just return a success message
    res.json({ 
      message: "Skill trends update initiated",
      note: "This endpoint should be called by a scheduled job to update trending skills data"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
