// Get all experience for a user (by id in body, fallback to token)
export const getAllExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ experience: user.experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all education for a user (by id in body, fallback to token)
export const getAllEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ education: user.education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for a user (by id in body, fallback to token)
export const getAllProjects = async (req, res) => {
  try {
   const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ projects: user.projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all certifications for a user (by id in body, fallback to token)
export const getAllCertifications = async (req, res) => {
  try {
   const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ certifications: user.certifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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

// Get user by ID (from token)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("savedCourses savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update basic profile (from token)
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

// Deactivate user (from token)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deactivated", user });
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
// expects { ...experience }
export const addExperience = async (req, res) => {
  try {
    const experience = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.experience.push(experience);
    await user.save();
    res.json({ message: "Experience added", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { expId, ...fields }
export const updateExperience = async (req, res) => {
  try {
    const { expId, ...fields } = req.body;
    const experience = await updateSubDoc(
      req.user.id,
      "experience",
      expId,
      fields
    );
    res.json({ message: "Experience updated", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { expId }
export const deleteExperience = async (req, res) => {
  try {
    const { expId } = req.body;
    await deleteSubDoc(req.user.id, "experience", expId);
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------- Education ----------------------
// expects { ...education }
export const addEducation = async (req, res) => {
  try {
    const education = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.education.push(education);
    await user.save();
    res.json({ message: "Education added", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { eduId, ...fields }
export const updateEducation = async (req, res) => {
  try {
    const { eduId, ...fields } = req.body;
    const education = await updateSubDoc(
      req.user.id,
      "education",
      eduId,
      fields
    );
    res.json({ message: "Education updated", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { eduId }
export const deleteEducation = async (req, res) => {
  try {
    const { eduId } = req.body;
    await deleteSubDoc(req.user.id, "education", eduId);
    res.json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------- Project ----------------------
// expects { ...project }
export const addProject = async (req, res) => {
  try {
    const project = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.projects.push(project);
    await user.save();
    res.json({ message: "Project added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { projectId, ...fields }
export const updateProject = async (req, res) => {
  try {
    const { projectId, ...fields } = req.body;
    const project = await updateSubDoc(
      req.user.id,
      "projects",
      projectId,
      fields
    );
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { projectId }
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    await deleteSubDoc(req.user.id, "projects", projectId);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------- Certification ----------------------
// expects { ...certification }
export const addCertification = async (req, res) => {
  try {
    const certification = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.certifications.push(certification);
    await user.save();
    res.json({ message: "Certification added", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { certId, ...fields }
export const updateCertification = async (req, res) => {
  try {
    const { certId, ...fields } = req.body;
    const certification = await updateSubDoc(
      req.user.id,
      "certifications",
      certId,
      fields
    );
    res.json({ message: "Certification updated", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// expects { certId }
export const deleteCertification = async (req, res) => {
  try {
    const { certId } = req.body;
    await deleteSubDoc(req.user.id, "certifications", certId);
    res.json({ message: "Certification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
