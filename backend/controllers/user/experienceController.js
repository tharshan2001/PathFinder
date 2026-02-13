import User from "../../models/user/User.js";
import { updateSubDoc, deleteSubDoc } from "./subDocHelpers.js";

// Get all experience
export const getAllExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ experience: user.experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add experience
export const addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const experience = req.body;
    user.experience.push(experience);
    await user.save();

    res.json({ message: "Experience added", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update experience
export const updateExperience = async (req, res) => {
  try {
    const { expId, ...fields } = req.body;
    const experience = await updateSubDoc(req.user.id, "experience", expId, fields);
    res.json({ message: "Experience updated", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const { expId } = req.body;
    await deleteSubDoc(req.user.id, "experience", expId);
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
