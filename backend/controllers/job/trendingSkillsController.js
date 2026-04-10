import TrendingSkills from "../../models/job/TrendingSkills.js";
import Job from "../../models/job/Job.js";

const toSkillKey = (value) => String(value || "").trim().toLowerCase();

const toDisplaySkill = (value) => String(value || "").trim();

const getSalaryPoint = (job) => {
  const min = Number(job?.salary?.min);
  const max = Number(job?.salary?.max);

  const hasMin = Number.isFinite(min) && min > 0;
  const hasMax = Number.isFinite(max) && max > 0;

  if (hasMin && hasMax) return (min + max) / 2;
  if (hasMin) return min;
  if (hasMax) return max;

  return null;
};

const clampGrowthRate = (value) => {
  if (value > 500) return 500;
  if (value < -100) return -100;
  return value;
};

const getTrendDirection = (growthRate) => {
  if (growthRate > 5) return "rising";
  if (growthRate < -5) return "declining";
  return "stable";
};

const toTopBreakdown = (map, totalCount, keyField) => {
  return Array.from(map.entries())
    .map(([name, stats]) => ({
      [keyField]: name,
      demandScore: totalCount > 0 ? Math.round((stats.count / totalCount) * 100) : 0,
      averageSalary:
        stats.salaryCount > 0 ? Math.round(stats.salarySum / stats.salaryCount) : 0,
      count: stats.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => {
      const { count, ...payload } = item;
      return payload;
    });
};

const emptyExperienceDemand = {
  entry: 0,
  mid: 0,
  senior: 0,
  lead: 0,
};

const levelToExperienceKey = {
  "Entry-level": "entry",
  "Mid-level": "mid",
  Senior: "senior",
  Lead: "lead",
  Manager: "lead",
  Director: "lead",
};

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
    const now = new Date();
    const recentWindowStart = new Date(now);
    recentWindowStart.setDate(now.getDate() - 30);

    const previousWindowStart = new Date(recentWindowStart);
    previousWindowStart.setDate(recentWindowStart.getDate() - 30);

    const jobs = await Job.find({ isActive: true }).select(
      "skillsRequired salary location category postedDate remotePolicy"
    );

    const skillMap = new Map();

    for (const job of jobs) {
      const rawSkills = Array.isArray(job.skillsRequired)
        ? job.skillsRequired.map((entry) => entry?.name)
        : [];
      const uniqueSkills = Array.from(
        new Set(rawSkills.map((value) => toDisplaySkill(value)).filter(Boolean))
      );

      if (uniqueSkills.length === 0) {
        continue;
      }

      const salaryPoint = getSalaryPoint(job);
      const postedDate = job.postedDate ? new Date(job.postedDate) : null;
      const isRecent = postedDate && postedDate >= recentWindowStart;
      const isPrevious =
        postedDate && postedDate >= previousWindowStart && postedDate < recentWindowStart;
      const isRemoteRelevant = ["Remote", "Remote-friendly", "Hybrid"].includes(
        job.remotePolicy
      );
      const location = String(job.location || "").trim();
      const industry = String(job?.category?.industry || "").trim();
      const experienceKey = levelToExperienceKey[job?.category?.level] || "mid";

      for (const skillName of uniqueSkills) {
        const key = toSkillKey(skillName);
        if (!key) continue;

        let metric = skillMap.get(key);
        if (!metric) {
          metric = {
            skill: skillName,
            totalCount: 0,
            recentCount: 0,
            previousCount: 0,
            remoteCount: 0,
            salarySum: 0,
            salaryCount: 0,
            locationStats: new Map(),
            industryStats: new Map(),
            experienceLevelDemand: { ...emptyExperienceDemand },
          };
          skillMap.set(key, metric);
        }

        metric.totalCount += 1;
        if (isRecent) metric.recentCount += 1;
        if (isPrevious) metric.previousCount += 1;
        if (isRemoteRelevant) metric.remoteCount += 1;
        metric.experienceLevelDemand[experienceKey] += 1;

        if (Number.isFinite(salaryPoint)) {
          metric.salarySum += salaryPoint;
          metric.salaryCount += 1;
        }

        if (location) {
          const existingLocation = metric.locationStats.get(location) || {
            count: 0,
            salarySum: 0,
            salaryCount: 0,
          };
          existingLocation.count += 1;
          if (Number.isFinite(salaryPoint)) {
            existingLocation.salarySum += salaryPoint;
            existingLocation.salaryCount += 1;
          }
          metric.locationStats.set(location, existingLocation);
        }

        if (industry) {
          const existingIndustry = metric.industryStats.get(industry) || {
            count: 0,
            salarySum: 0,
            salaryCount: 0,
          };
          existingIndustry.count += 1;
          if (Number.isFinite(salaryPoint)) {
            existingIndustry.salarySum += salaryPoint;
            existingIndustry.salaryCount += 1;
          }
          metric.industryStats.set(industry, existingIndustry);
        }
      }
    }

    const allMetrics = Array.from(skillMap.values());
    const maxJobCount = allMetrics.reduce(
      (max, metric) => (metric.totalCount > max ? metric.totalCount : max),
      0
    );

    const existingSkills = await TrendingSkills.find();
    const existingMap = new Map(existingSkills.map((doc) => [toSkillKey(doc.skill), doc]));

    let created = 0;
    let updated = 0;
    let archived = 0;

    for (const metric of allMetrics) {
      const key = toSkillKey(metric.skill);
      const existing = existingMap.get(key);

      const demandScore = maxJobCount > 0 ? Math.round((metric.totalCount / maxJobCount) * 100) : 0;
      let growthRate = 0;
      if (metric.previousCount === 0) {
        growthRate = metric.recentCount > 0 ? 100 : 0;
      } else {
        growthRate = ((metric.recentCount - metric.previousCount) / metric.previousCount) * 100;
      }
      growthRate = Number(clampGrowthRate(Number(growthRate.toFixed(2))));

      const trendDirection = getTrendDirection(growthRate);
      const averageSalary =
        metric.salaryCount > 0 ? Math.round(metric.salarySum / metric.salaryCount) : 0;
      const topLocations = toTopBreakdown(metric.locationStats, metric.totalCount, "location");
      const topIndustries = toTopBreakdown(metric.industryStats, metric.totalCount, "industry");
      const remoteDemandScore =
        metric.totalCount > 0 ? Math.round((metric.remoteCount / metric.totalCount) * 100) : 0;

      const historicalData = [...(existing?.historicalData || [])];
      historicalData.push({
        date: now,
        demandScore,
        jobCount: metric.totalCount,
        averageSalary,
      });
      const cappedHistoricalData = historicalData.slice(-24);

      const payload = {
        skill: metric.skill,
        demandScore,
        jobCount: metric.totalCount,
        averageSalary,
        salaryCurrency: existing?.salaryCurrency || "USD",
        growthRate,
        trendDirection,
        category: existing?.category || topIndustries[0]?.industry || "",
        topLocations,
        topIndustries,
        experienceLevelDemand: metric.experienceLevelDemand,
        remoteDemandScore,
        historicalData: cappedHistoricalData,
        lastUpdated: now,
        skillType: existing?.skillType || "technical",
      };

      if (existing) {
        Object.assign(existing, payload);
        await existing.save();
        updated += 1;
      } else {
        const createdDoc = new TrendingSkills(payload);
        await createdDoc.save();
        created += 1;
      }
    }

    for (const existing of existingSkills) {
      const key = toSkillKey(existing.skill);
      if (skillMap.has(key)) {
        continue;
      }

      const zeroHistory = [...(existing.historicalData || [])];
      zeroHistory.push({
        date: now,
        demandScore: 0,
        jobCount: 0,
        averageSalary: 0,
      });

      const previousJobCount = Number(existing.jobCount || 0);
      existing.demandScore = 0;
      existing.jobCount = 0;
      existing.averageSalary = 0;
      existing.growthRate = previousJobCount > 0 ? -100 : 0;
      existing.trendDirection = getTrendDirection(existing.growthRate);
      existing.topLocations = [];
      existing.topIndustries = [];
      existing.experienceLevelDemand = { ...emptyExperienceDemand };
      existing.remoteDemandScore = 0;
      existing.historicalData = zeroHistory.slice(-24);
      existing.lastUpdated = now;

      await existing.save();
      archived += 1;
    }

    res.json({
      message: "Skill trends updated successfully",
      summary: {
        activeJobsAnalyzed: jobs.length,
        skillsComputed: allMetrics.length,
        created,
        updated,
        archived,
      },
      windows: {
        recentWindowStart,
        previousWindowStart,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
