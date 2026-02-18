import JobCategory from "../../models/job/JobCategory.js";

// ---------------------- Job Category CRUD ----------------------

// Create a new job category
export const createJobCategory = async (req, res) => {
  try {
    const category = new JobCategory(req.body);
    await category.save();
    res.status(201).json({ message: "Job category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all job categories
export const getJobCategories = async (req, res) => {
  try {
    const { type, isActive = true } = req.query;
    
    const query = { isActive: isActive === "true" };
    if (type) {
      query.type = type;
    }

    const categories = await JobCategory.find(query)
      .populate("parentCategory", "name")
      .sort({ sortOrder: 1, name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get job category by ID
export const getJobCategoryById = async (req, res) => {
  try {
    const category = await JobCategory.findById(req.params.id)
      .populate("parentCategory", "name")
      .populate("subcategories", "name slug");

    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job category
export const updateJobCategory = async (req, res) => {
  try {
    const category = await JobCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("parentCategory", "name");

    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    res.json({ message: "Job category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job category
export const deleteJobCategory = async (req, res) => {
  try {
    const category = await JobCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    res.json({ message: "Job category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get categories by type
export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { isActive = true } = req.query;

    const categories = await JobCategory.find({ 
      type, 
      isActive: isActive === "true" 
    })
    .populate("parentCategory", "name")
    .sort({ sortOrder: 1, name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured categories
export const getFeaturedCategories = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;

    const query = { isFeatured: true, isActive: true };
    if (type) {
      query.type = type;
    }

    const categories = await JobCategory.find(query)
      .sort({ sortOrder: 1, jobCount: -1 })
      .limit(parseInt(limit));

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get popular categories (by job count)
export const getPopularCategories = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;

    const query = { isActive: true };
    if (type) {
      query.type = type;
    }

    const categories = await JobCategory.find(query)
      .sort({ jobCount: -1, viewCount: -1 })
      .limit(parseInt(limit));

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update category job count
export const updateCategoryJobCount = async (req, res) => {
  try {
    const { increment = 1 } = req.body;

    const category = await JobCategory.findByIdAndUpdate(
      req.params.id,
      { $inc: { jobCount: increment } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    res.json({ message: "Job count updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
