import mongoose from "mongoose";
import JobAlert from "../../models/job/JobAlert.js";
import Job from "../../models/job/Job.js";

// ---------------------- Job Alert CRUD ----------------------

// Create a new job alert
export const createJobAlert = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user; // Will use auth middleware later
    
    const alertData = {
      ...req.body,
      user: userId
    };

    const alert = new JobAlert(alertData);
    await alert.save();

    await alert.populate("user", "name email");
    res.status(201).json({ message: "Job alert created successfully", alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's job alerts
export const getUserJobAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive = "true" } = req.query;

    const isActiveBool = isActive === "true" || isActive === true;

    const alerts = await JobAlert.find({ 
      user: userId, 
      isActive: isActiveBool
    })
    .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get job alert by ID
export const getJobAlertById = async (req, res) => {
  try {
    const alert = await JobAlert.findById(req.params.id)
      .populate("user", "name email");

    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job alert
export const updateJobAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    res.json({ message: "Job alert updated successfully", alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job alert
export const deleteJobAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    res.json({ message: "Job alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle job alert active status
export const toggleJobAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).populate("user", "name email");

    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    res.json({ message: `Job alert ${alert.isActive ? "activated" : "deactivated"}`, alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Alert Matching ----------------------

// Find matching jobs for an alert
export const findMatchingJobs = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { limit = 10 } = req.query;

    const alert = await JobAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    // Build job query based on alert criteria
    const jobQuery = { isActive: true };

    // Keywords search
    if (alert.keywords && alert.keywords.length > 0) {
      jobQuery.$or = alert.keywords.map(keyword => ({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }
        ]
      }));
    }

    // Location filter
    if (alert.location) {
      jobQuery.location = { $regex: alert.location, $options: "i" };
    }

    // Remote policy filter
    if (alert.remotePolicy && alert.remotePolicy !== "any") {
      jobQuery.remotePolicy = alert.remotePolicy;
    }

    // Industry filter
    if (alert.industries && alert.industries.length > 0) {
      jobQuery["category.industry"] = { $in: alert.industries };
    }

    // Role filter
    if (alert.roles && alert.roles.length > 0) {
      jobQuery["category.role"] = { $in: alert.roles };
    }

    // Level filter
    if (alert.levels && alert.levels.length > 0) {
      jobQuery["category.level"] = { $in: alert.levels };
    }

    // Employment type filter
    if (alert.employmentTypes && alert.employmentTypes.length > 0) {
      jobQuery.employmentType = { $in: alert.employmentTypes };
    }

    // Salary range filter
    if (alert.salaryRange) {
      if (alert.salaryRange.min) {
        jobQuery["salary.min"] = { $gte: alert.salaryRange.min };
      }
      if (alert.salaryRange.max) {
        jobQuery["salary.max"] = { $lte: alert.salaryRange.max };
      }
    }

    // Skills filter
    if (alert.skills && alert.skills.length > 0) {
      jobQuery.skillsRequired = { $in: alert.skills };
    }

    // Companies filter
    if (alert.companies && alert.companies.length > 0) {
      jobQuery.company = { $in: alert.companies };
    }

    // Exclude keywords
    if (alert.excludeKeywords && alert.excludeKeywords.length > 0) {
      jobQuery.$and = jobQuery.$and || [];
      alert.excludeKeywords.forEach(keyword => {
        jobQuery.$and.push({
          $and: [
            { title: { $not: { $regex: keyword, $options: "i" } } },
            { description: { $not: { $regex: keyword, $options: "i" } } }
          ]
        });
      });
    }

    // Exclude companies
    if (alert.excludeCompanies && alert.excludeCompanies.length > 0) {
      jobQuery.company = { $nin: alert.excludeCompanies };
    }

    const matchingJobs = await Job.find(jobQuery)
      .populate("postedBy", "name headline profileMedia")
      .sort({ postedDate: -1 })
      .limit(parseInt(limit));

    // Update alert statistics
    await JobAlert.findByIdAndUpdate(alertId, {
      lastMatchCount: matchingJobs.length,
      totalMatches: alert.totalMatches + matchingJobs.length
    });

    res.json({
      alert,
      matchingJobs,
      matchCount: matchingJobs.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Alert Processing ----------------------

// Process all active alerts (for cron job)
export const processAllAlerts = async (req, res) => {
  try {
    const { frequency } = req.query; // instant, daily, weekly
    
    const query = { isActive: true };
    if (frequency) {
      query.frequency = frequency;
    }

    const alerts = await JobAlert.find(query)
      .populate("user", "name email");

    const results = [];

    for (const alert of alerts) {
      try {
        // Build job query (same logic as findMatchingJobs)
        const jobQuery = { isActive: true, postedDate: { $gte: alert.lastRun || new Date(0) } };

        // Apply all alert filters (simplified for brevity)
        if (alert.keywords && alert.keywords.length > 0) {
          jobQuery.$text = { $search: alert.keywords.join(" ") };
        }
        if (alert.location) {
          jobQuery.location = { $regex: alert.location, $options: "i" };
        }
        if (alert.skills && alert.skills.length > 0) {
          jobQuery.skillsRequired = { $in: alert.skills };
        }

        const matchingJobs = await Job.find(jobQuery)
          .populate("postedBy", "name headline")
          .sort({ postedDate: -1 })
          .limit(20);

        if (matchingJobs.length > 0) {
          // Here you would typically send notifications
          // For now, just collect the results
          results.push({
            alertId: alert._id,
            userId: alert.user._id,
            userEmail: alert.user.email,
            matchCount: matchingJobs.length,
            jobs: matchingJobs
          });

          // Update alert
          await JobAlert.findByIdAndUpdate(alert._id, {
            lastRun: new Date(),
            lastMatchCount: matchingJobs.length,
            totalMatches: alert.totalMatches + matchingJobs.length
          });
        }
      } catch (error) {
        console.error(`Error processing alert ${alert._id}:`, error);
      }
    }

    res.json({
      message: "Alert processing completed",
      processedAlerts: alerts.length,
      alertsWithMatches: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Alert Analytics ----------------------

// Get alert statistics
export const getAlertStatistics = async (req, res) => {
  try {
    const { userId } = req.query;

    const matchStage = {};
    if (userId) {
      matchStage.user = new mongoose.Types.ObjectId(userId);
    }

    const stats = await JobAlert.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAlerts: { $sum: 1 },
          activeAlerts: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
          },
          totalMatches: { $sum: "$totalMatches" },
          avgMatchesPerAlert: { $avg: "$totalMatches" }
        }
      }
    ]);

    const alertsByFrequency = await JobAlert.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$frequency",
          count: { $sum: 1 }
        }
      }
    ]);

    const topPerformingAlerts = await JobAlert.find(matchStage)
      .sort({ totalMatches: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      overview: stats[0] || {},
      byFrequency: alertsByFrequency,
      topPerforming: topPerformingAlerts
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
