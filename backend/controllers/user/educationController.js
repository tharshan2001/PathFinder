import User from "../../models/user/User.js";
import { updateSubDoc, deleteSubDoc } from "./subDocHelpers.js";

// Get all education
export const getAllEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ education: user.education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add education
export const addEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const education = req.body;
    user.education.push(education);
    await user.save();

    res.json({ message: "Education added", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update education
export const updateEducation = async (req, res) => {
  try {
    const { eduId, ...fields } = req.body;
    const education = await updateSubDoc(req.user.id, "education", eduId, fields);
    res.json({ message: "Education updated", education });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete education
export const deleteEducation = async (req, res) => {
  try {
    const { eduId } = req.body;
    await deleteSubDoc(req.user.id, "education", eduId);
    res.json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
