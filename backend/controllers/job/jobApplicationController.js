import mongoose from "mongoose";
import JobApplication from "../../models/job/JobApplication.js";
import Job from "../../models/job/Job.js";

// ---------------------- Job Application CRUD ----------------------

// Submit a job application
export const submitApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id || req.body.applicant; // Will use auth middleware later

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found or inactive" });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create application
    const applicationData = {
      job: jobId,
      applicant: userId,
      ...req.body
    };

    const application = new JobApplication(applicationData);
    await application.save();

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    // Populate related data
    await application.populate([
      { path: "job", select: "title company location" },
      { path: "applicant", select: "name email headline" }
    ]);

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications for a specific job (for recruiters)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate("applicant", "name email headline profileMedia location")
      .populate("job", "title company location")
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments(query);

    res.json({
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { applicant: userId };
    if (status) {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate("job", "title company location salary employmentType")
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments(query);

    res.json({
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate("applicant", "name email headline profileMedia experience education skills")
      .populate("job", "title company location description skillsRequired salary")
      .populate("reviewedBy", "name headline");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, reviewNotes, reviewedBy } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedBy,
        reviewDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate("applicant", "name email")
     .populate("job", "title company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Schedule interview
export const scheduleInterview = async (req, res) => {
  try {
    const { date, type, location, notes } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: "interview_scheduled",
        "interviewSchedule.date": new Date(date),
        "interviewSchedule.type": type,
        "interviewSchedule.location": location,
        "interviewSchedule.notes": notes
      },
      { new: true, runValidators: true }
    ).populate("applicant", "name email")
     .populate("job", "title company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Interview scheduled", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add communication to application
export const addCommunication = async (req, res) => {
  try {
    const { type, subject, message, sentBy } = req.body;

    const communication = {
      date: new Date(),
      type,
      subject,
      message,
      sentBy
    };

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        $push: { communications: communication }
      },
      { new: true }
    ).populate("communications.sentBy", "name headline");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Communication added", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: "withdrawn" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update job application count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationsCount: -1 }
    });

    res.json({ message: "Application withdrawn", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete application (admin only)
export const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update job application count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationsCount: -1 }
    });

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Application Analytics ----------------------

// Get application statistics
export const getApplicationStatistics = async (req, res) => {
  try {
    const { jobId, userId } = req.query;

    let matchStage = {};
    if (jobId) matchStage.job = new mongoose.Types.ObjectId(jobId);
    if (userId) matchStage.applicant = new mongoose.Types.ObjectId(userId);

    const stats = await JobApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          statusBreakdown: {
            $push: {
              status: "$status",
              count: 1
            }
          },
          avgDaysToResponse: {
            $avg: {
              $subtract: ["$reviewDate", "$appliedDate"]
            }
          }
        }
      }
    ]);

    const applicationsByStatus = await JobApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationsByMonth = await JobApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$appliedDate" },
            month: { $month: "$appliedDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json({
      overview: stats[0] || {},
      byStatus: applicationsByStatus,
      byMonth: applicationsByMonth
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications by status
export const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const applications = await JobApplication.find({ status })
      .populate("applicant", "name headline profileMedia")
      .populate("job", "title company location")
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments({ status });

    res.json({
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
