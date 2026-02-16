import { uploadToS3 } from "../../middleware/uploadMiddleware.js"; // named import
import User from "../../models/user/User.js";

// ---------------- Upload Resume ----------------
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) 
      return res.status(400).json({ message: "No file uploaded" });

    // Upload to S3 (folder: resumes/)
    const url = await uploadToS3(req.file, "resumes/");

    // Save resume URL to user's resumes array
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumes: { fileUrl: url, uploadedAt: new Date() } } },
      { new: true }
    );

    res.status(200).json({ message: "Resume uploaded successfully", url, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload resume", error: error.message });
  }
};

// ---------------- Get All Resumes ----------------
export const getAllResumes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ resumes: user.resumes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resumes", error: err.message });
  }
};

// ---------------- Delete a Resume ----------------
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId)
      return res.status(400).json({ message: "resumeId is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resumes = user.resumes.filter(r => r._id.toString() !== resumeId);
    await user.save();

    res.status(200).json({ message: "Resume deleted successfully", resumes: user.resumes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete resume", error: err.message });
  }
};
