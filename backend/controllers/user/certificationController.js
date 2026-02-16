import User from "../../models/user/User.js";
import { updateSubDoc, deleteSubDoc } from "./subDocHelpers.js";

// Get all certifications
export const getAllCertifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ certifications: user.certifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add certification
export const addCertification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const certification = req.body;
    user.certifications.push(certification);
    await user.save();

    res.json({ message: "Certification added", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update certification
export const updateCertification = async (req, res) => {
  try {
    const { certId, ...fields } = req.body;
    const certification = await updateSubDoc(req.user.id, "certifications", certId, fields);
    res.json({ message: "Certification updated", certification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete certification
export const deleteCertification = async (req, res) => {
  try {
    const { certId } = req.body;
    await deleteSubDoc(req.user.id, "certifications", certId);
    res.json({ message: "Certification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
