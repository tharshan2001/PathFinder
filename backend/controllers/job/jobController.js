import Job from "../../models/job/Job.js";
import JobCategory from "../../models/job/JobCategory.js";
import TrendingSkills from "../../models/job/TrendingSkills.js";

// ---------------------- Job CRUD ----------------------

// Create a new job posting
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user?.id || req.body.postedBy // Will use auth middleware later
    };

    const job = new Job(jobData);
    await job.save();

    // Update job count in category if provided
    if (job.category.industry) {
      await JobCategory.findOneAndUpdate(
        { name: job.category.industry, type: "industry" },
        { $inc: { jobCount: 1 } },
        { upsert: true }
      );
    }

    // Update trending skills for required skills
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      for (const skill of job.skillsRequired) {
        await TrendingSkills.findOneAndUpdate(
          { skill },
          { 
            $inc: { jobCount: 1 },
            $setOnInsert: { 
              skill,
              demandScore: Math.min(100, (job.skillsRequired.length * 5))
            }
          },
          { upsert: true }
        );
      }
    }

    await job.populate("postedBy", "name headline profileMedia");
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs with filtering and pagination
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      industry,
      role,
      level,
      employmentType,
      remotePolicy,
      skills,
      salaryMin,
      salaryMax,
      sortBy = "postedDate",
      sortOrder = "desc",
      isActive = "true"
    } = req.query;

    // Build query
    const isActiveBool = isActive === "true" || isActive === true;
    const query = { isActive: isActiveBool };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    
    if (industry) {
      query["category.industry"] = industry;
    }
    
    if (role) {
      query["category.role"] = role;
    }
    
    if (level) {
      query["category.level"] = level;
    }
    
    if (employmentType) {
      query.employmentType = employmentType;
    }
    
    if (remotePolicy) {
      query.remotePolicy = remotePolicy;
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(",");
      query.skillsRequired = { $in: skillsArray };
    }
    
    if (salaryMin || salaryMax) {
      query["salary.min"] = {};
      if (salaryMin) query["salary.min"].$gte = parseInt(salaryMin);
      if (salaryMax) query["salary.max"] = { $lte: parseInt(salaryMax) };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "name headline profileMedia")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
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

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name headline profileMedia companySize");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Increment view count
    job.viewsCount += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("postedBy", "name headline profileMedia");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job (soft delete)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job count in category
    if (job.category.industry) {
      await JobCategory.findOneAndUpdate(
        { name: job.category.industry, type: "industry" },
        { $inc: { jobCount: -1 } }
      );
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Featured Jobs ----------------------

// Get featured jobs
export const getFeaturedJobs = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const jobs = await Job.find({ isActive: true, isFeatured: true })
      .populate("postedBy", "name headline profileMedia")
      .sort({ postedDate: -1 })
      .limit(parseInt(limit));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Recent Jobs ----------------------

// Get recent jobs
export const getRecentJobs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const jobs = await Job.find({ isActive: true })
      .populate("postedBy", "name headline profileMedia")
      .sort({ postedDate: -1 })
      .limit(parseInt(limit));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Job Statistics ----------------------

// Get job statistics
export const getJobStatistics = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalViews: { $sum: "$viewsCount" },
          totalApplications: { $sum: "$applicationsCount" },
          avgSalaryMin: { $avg: "$salary.min" },
          avgSalaryMax: { $avg: "$salary.max" }
        }
      }
    ]);

    const jobsByIndustry = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category.industry",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const jobsByLevel = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category.level",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {},
      byIndustry: jobsByIndustry,
      byLevel: jobsByLevel
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Job Search ----------------------

// Advanced job search
export const searchJobs = async (req, res) => {
  try {
    const {
      q: searchQuery,
      filters = {},
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        if (key.includes(".")) {
          const [parent, child] = key.split(".");
          query[parent] = query[parent] || {};
          query[parent][child] = filters[key];
        } else {
          query[key] = filters[key];
        }
      }
    });

    const jobs = await Job.find(query)
      .populate("postedBy", "name headline profileMedia")
      .sort(searchQuery ? { score: { $meta: "textScore" } } : { postedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
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
