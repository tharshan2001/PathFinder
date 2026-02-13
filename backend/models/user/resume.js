import mongoose from "mongoose";

export const resumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },  // S3 URL
  fileType: { type: String, required: true }, // e.g., "application/pdf"
  fileSize: { type: Number, required: true }, // in bytes
  uploadedAt: { type: Date, default: Date.now }
});
