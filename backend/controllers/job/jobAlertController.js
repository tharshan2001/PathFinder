import mongoose from "mongoose";
import JobAlert from "../../models/job/JobAlert.js";
import Job from "../../models/job/Job.js";
import Notification from "../../models/user/Notification.js";

const isAdmin = (req) => String(req.user?.role || "").toLowerCase() === "admin";
const isSelf = (req, userId) => String(req.user?.id) === String(userId);

let cachedEmailTransporter;

const getEmailTransporter = async () => {
  if (cachedEmailTransporter !== undefined) {
    return cachedEmailTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    cachedEmailTransporter = null;
    return cachedEmailTransporter;
  }

  try {
    const nodemailerModule = await import("nodemailer");
    const nodemailer = nodemailerModule.default || nodemailerModule;

    cachedEmailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    return cachedEmailTransporter;
  } catch (error) {
    console.warn("Email transport unavailable:", error.message);
    cachedEmailTransporter = null;
    return cachedEmailTransporter;
  }
};

const sendAlertEmailNotification = async ({ alert, user, jobs }) => {
  if (!alert.emailNotifications) {
    return { sent: false, reason: "email-disabled" };
  }

  if (!user?.email) {
    return { sent: false, reason: "missing-user-email" };
  }

  const transporter = await getEmailTransporter();
  if (!transporter) {
    return { sent: false, reason: "smtp-not-configured" };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const userName = user.name || "there";
  const topJobsHtml = jobs
    .slice(0, 5)
    .map(
      (job) =>
        `<li><strong>${job.title}</strong> at ${job.company || "Unknown company"}${
          job.location ? ` (${job.location})` : ""
        }</li>`
    )
    .join("");

  const subject = `PathFinder Alert: ${jobs.length} new match${jobs.length === 1 ? "" : "es"}`;
  const html = `
    <p>Hi ${userName},</p>
    <p>Your alert <strong>${alert.title}</strong> found <strong>${jobs.length}</strong> new matching job${
      jobs.length === 1 ? "" : "s"
    }.</p>
    <ul>${topJobsHtml}</ul>
    <p>Open PathFinder to review all matches.</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to: user.email,
      subject,
      html,
    });

    return { sent: true };
  } catch (error) {
    console.error("Failed to send alert email:", error.message);
    return { sent: false, reason: "email-send-failed" };
  }
};

const createPushNotificationRecord = async ({ alert, user, jobs }) => {
  if (!alert.pushNotifications) {
    return { sent: false, reason: "push-disabled" };
  }

  if (!user?._id) {
    return { sent: false, reason: "missing-user-id" };
  }

  try {
    await Notification.create({
      userId: user._id,
      type: "job",
      title: `Job Alert: ${jobs.length} new match${jobs.length === 1 ? "" : "es"}`,
      message: `Your alert \"${alert.title}\" found ${jobs.length} new job match${
        jobs.length === 1 ? "" : "es"
      }.`,
      link: "/jobs",
      metadata: {
        alertId: alert._id,
        alertTitle: alert.title,
        matchCount: jobs.length,
        jobIds: jobs.map((job) => job._id),
      },
    });

    return { sent: true };
  } catch (error) {
    console.error("Failed to create push notification record:", error.message);
    return { sent: false, reason: "push-record-create-failed" };
  }
};

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

    if (!isAdmin(req) && !isSelf(req, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

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

    const alertUserId = alert.user?._id || alert.user;
    if (!isAdmin(req) && !isSelf(req, alertUserId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job alert
export const updateJobAlert = async (req, res) => {
  try {
    const existing = await JobAlert.findById(req.params.id).select("user");
    if (!existing) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    if (!isAdmin(req) && !isSelf(req, existing.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const alert = await JobAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    res.json({ message: "Job alert updated successfully", alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job alert
export const deleteJobAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    if (!isAdmin(req) && !isSelf(req, alert.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await JobAlert.findByIdAndDelete(req.params.id);

    res.json({ message: "Job alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle job alert active status
export const toggleJobAlert = async (req, res) => {
  try {
    const existing = await JobAlert.findById(req.params.id).select("user");
    if (!existing) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    if (!isAdmin(req) && !isSelf(req, existing.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const alert = await JobAlert.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).populate("user", "name email");

    res.json({ message: `Job alert ${alert.isActive ? "activated" : "deactivated"}`, alert });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Alert Matching ----------------------

// Find matching jobs for an alert
export const findMatchingJobs = async (req, res) => {
  try {
    const { id: alertId } = req.params;
    const { limit = 10 } = req.query;

    const alert = await JobAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: "Job alert not found" });
    }

    if (!isAdmin(req) && !isSelf(req, alert.user)) {
      return res.status(403).json({ message: "Access denied" });
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
      jobQuery["skillsRequired.name"] = { $in: alert.skills };
    }

    // Companies include/exclude filters
    if (
      (alert.companies && alert.companies.length > 0) ||
      (alert.excludeCompanies && alert.excludeCompanies.length > 0)
    ) {
      jobQuery.company = {};

      if (alert.companies && alert.companies.length > 0) {
        jobQuery.company.$in = alert.companies;
      }

      if (alert.excludeCompanies && alert.excludeCompanies.length > 0) {
        jobQuery.company.$nin = alert.excludeCompanies;
      }
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
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { frequency } = req.query; // instant, daily, weekly
    
    const query = { isActive: true };
    if (frequency) {
      query.frequency = frequency;
    }

    const alerts = await JobAlert.find(query)
      .populate("user", "name email");

    const results = [];
    let emailSent = 0;
    let pushSent = 0;
    let emailSkipped = 0;
    let pushSkipped = 0;

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
          jobQuery["skillsRequired.name"] = { $in: alert.skills };
        }

        const matchingJobs = await Job.find(jobQuery)
          .populate("postedBy", "name headline")
          .sort({ postedDate: -1 })
          .limit(20);

        const emailResult =
          matchingJobs.length > 0
            ? await sendAlertEmailNotification({
                alert,
                user: alert.user,
                jobs: matchingJobs,
              })
            : { sent: false, reason: "no-matches" };
        const pushResult =
          matchingJobs.length > 0
            ? await createPushNotificationRecord({
                alert,
                user: alert.user,
                jobs: matchingJobs,
              })
            : { sent: false, reason: "no-matches" };

        if (emailResult.sent) emailSent += 1;
        else emailSkipped += 1;

        if (pushResult.sent) pushSent += 1;
        else pushSkipped += 1;

        if (matchingJobs.length > 0) {
          results.push({
            alertId: alert._id,
            alertTitle: alert.title,
            userId: alert.user._id,
            userEmail: alert.user.email,
            matchCount: matchingJobs.length,
            notifications: {
              email: emailResult,
              push: pushResult,
            },
            jobs: matchingJobs.map((job) => ({
              _id: job._id,
              title: job.title,
              company: job.company,
              location: job.location,
              postedDate: job.postedDate,
            })),
          });
        }

        await JobAlert.findByIdAndUpdate(alert._id, {
          lastRun: new Date(),
          lastMatchCount: matchingJobs.length,
          totalMatches: alert.totalMatches + matchingJobs.length,
        });
      } catch (error) {
        console.error(`Error processing alert ${alert._id}:`, error);
      }
    }

    res.json({
      message: "Alert processing completed",
      processedAlerts: alerts.length,
      alertsWithMatches: results.length,
      notificationSummary: {
        emailSent,
        pushSent,
        emailSkipped,
        pushSkipped,
      },
      results,
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
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      if (!isAdmin(req) && !isSelf(req, userId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      matchStage.user = new mongoose.Types.ObjectId(userId);
    } else if (!isAdmin(req)) {
      matchStage.user = new mongoose.Types.ObjectId(req.user.id);
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
