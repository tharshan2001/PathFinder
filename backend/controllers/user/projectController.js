import User from "../../models/user/User.js";
import { updateSubDoc, deleteSubDoc } from "./subDocHelpers.js";

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ projects: user.projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add project
export const addProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = req.body;
    user.projects.push(project);
    await user.save();

    res.json({ message: "Project added", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { projectId, ...fields } = req.body;
    const project = await updateSubDoc(req.user.id, "projects", projectId, fields);
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    await deleteSubDoc(req.user.id, "projects", projectId);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
