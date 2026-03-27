import User from "../../models/user/User.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by ID (from token)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedCourses savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deactivated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get public profile (no auth required)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "name headline about location profileMedia skills experience education certifications projects socialLinks connectionsCount profileViews"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Increment profile view
    await User.findByIdAndUpdate(userId, { $inc: { profileViews: 1 } });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save course
export const saveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.savedCourses.includes(courseId)) {
      user.savedCourses.push(courseId);
      await user.save();
    }
    res.json({ message: "Course saved", savedCourses: user.savedCourses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unsave course
export const unsaveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    user.savedCourses = user.savedCourses.filter(id => id.toString() !== courseId);
    await user.save();
    res.json({ message: "Course unsaved", savedCourses: user.savedCourses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    res.json({ message: "Job saved", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unsave job
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();
    res.json({ message: "Job unsaved", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get saved courses
export const getSavedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedCourses");
    res.json(user.savedCourses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedJobs");
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Enroll in learning path
export const enrollInPath = async (req, res) => {
  try {
    const { pathId } = req.params;
    const user = await User.findById(req.user.id);
    
    const alreadyEnrolled = user.enrolledPaths.find(p => p.pathId.toString() === pathId);
    if (!alreadyEnrolled) {
      user.enrolledPaths.push({ pathId, progress: 0, startedAt: new Date() });
      await user.save();
    }
    res.json({ message: "Enrolled in path", enrolledPaths: user.enrolledPaths });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update learning path progress
export const updatePathProgress = async (req, res) => {
  try {
    const { pathId } = req.params;
    const { lessonIndex, progress } = req.body;
    
    const user = await User.findById(req.user.id);
    const path = user.enrolledPaths.find(p => p.pathId.toString() === pathId);
    
    if (path) {
      if (lessonIndex !== undefined && !path.completedLessons.includes(lessonIndex)) {
        path.completedLessons.push(lessonIndex);
      }
      if (progress !== undefined) {
        path.progress = progress;
      }
      path.lastAccessedAt = new Date();
      await user.save();
    }
    
    res.json({ message: "Progress updated", enrolledPaths: user.enrolledPaths });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get enrolled paths
export const getEnrolledPaths = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("enrolledPaths.pathId");
    res.json(user.enrolledPaths);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user suggestions (people you may know)
export const getUserSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get all connection IDs (both as requester and recipient)
    const Connection = (await import("../../models/user/connectionRef.js")).default;
    
    const connections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }]
    });

    // Extract user IDs that are already connected (or have pending requests)
    const connectedUserIds = connections.map(c => 
      c.requester.toString() === currentUserId ? c.recipient : c.requester
    );
    // Add current user to exclude list
    connectedUserIds.push(currentUserId);

    // Find users who are not connected
    const suggestions = await User.find({
      _id: { $nin: connectedUserIds }
    })
    .select("name headline profileMedia skills location")
    .limit(limit);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
