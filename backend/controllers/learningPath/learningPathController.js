import LearningPath from "../../models/learningPath/LearningPath.js";

// Get all learning paths
export const getLearningPaths = async (req, res) => {
  try {
    const { category, level, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    
    const paths = await LearningPath.find(query)
      .populate("courses", "title thumbnail")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await LearningPath.countDocuments(query);
    
    res.json({
      paths,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get learning path by ID
export const getLearningPathById = async (req, res) => {
  try {
    const { id } = req.params;
    const path = await LearningPath.findById(id)
      .populate("courses", "title thumbnail description duration");
    
    if (!path) return res.status(404).json({ message: "Learning path not found" });
    
    // Increment views
    // await LearningPath.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    res.json(path);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create learning path (admin)
export const createLearningPath = async (req, res) => {
  try {
    const pathData = { ...req.body, createdBy: req.user.id };
    const path = new LearningPath(pathData);
    await path.save();
    res.status(201).json({ message: "Learning path created", path });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update learning path
export const updateLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const path = await LearningPath.findByIdAndUpdate(id, req.body, { new: true });
    if (!path) return res.status(404).json({ message: "Learning path not found" });
    res.json({ message: "Learning path updated", path });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete learning path
export const deleteLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const path = await LearningPath.findByIdAndDelete(id);
    if (!path) return res.status(404).json({ message: "Learning path not found" });
    res.json({ message: "Learning path deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await LearningPath.distinct("category", { isPublished: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's enrolled paths with progress
export const getMyEnrolledPaths = async (req, res) => {
  try {
    const User = (await import("../../models/user/User.js")).default;
    const user = await User.findById(req.user.id).populate({
      path: "enrolledPaths.pathId",
      select: "title thumbnail description modules duration level"
    });
    res.json(user.enrolledPaths);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
