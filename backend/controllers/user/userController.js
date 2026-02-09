import User from "../../models/user/User.js";

// ---------------------- User CRUD ----------------------

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

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("savedCourses savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update basic profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Deactivate user (instead of delete)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deactivated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------- Sub-document CRUD ----------------------

// Generic helper to update sub-documents
const updateSubDoc = async (userId, subDocArray, subDocId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const subDoc = user[subDocArray].id(subDocId);
  if (!subDoc) throw new Error("Item not found");

  Object.assign(subDoc, updates);
  await user.save();
  return subDoc;
};

// Generic helper to delete sub-documents
const deleteSubDoc = async (userId, subDocArray, subDocId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const subDoc = user[subDocArray].id(subDocId);
  if (!subDoc) throw new Error("Item not found");

  subDoc.remove();
  await user.save();
  return;
};

// ---------------------- Experience ----------------------
export const addExperience = async (req, res) => {
  try {
    const experience = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.experience.push(experience);
    await user.save();
    res.json({ message: "Experience added", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await updateSubDoc(
      req.params.id,
      "experience",
      req.params.expId,
      req.body
    );
    res.json({ message: "Experience updated", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    await deleteSubDoc(req.params.id, "experience", req.params.expId);
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- Education ----------------------
export const addEducation = async (req, res) => {
  try {
    const education = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.education.push(education);
    await user.save();
    res.json({ message: "Education added", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await updateSubDoc(
      req.params.id,
      "education",
      req.params.eduId,
      req.body
    );
    res.json({ message: "Education updated", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    await deleteSubDoc(req.params.id, "education", req.params.eduId);
    res.json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- Project ----------------------
export const addProject = async (req, res) => {
  try {
    const project = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.projects.push(project);
    await user.save();
    res.json({ message: "Project added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await updateSubDoc(
      req.params.id,
      "projects",
      req.params.projectId,
      req.body
    );
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await deleteSubDoc(req.params.id, "projects", req.params.projectId);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- Certification ----------------------
export const addCertification = async (req, res) => {
  try {
    const certification = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.certifications.push(certification);
    await user.save();
    res.json({ message: "Certification added", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const certification = await updateSubDoc(
      req.params.id,
      "certifications",
      req.params.certId,
      req.body
    );
    res.json({ message: "Certification updated", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    await deleteSubDoc(req.params.id, "certifications", req.params.certId);
    res.json({ message: "Certification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
