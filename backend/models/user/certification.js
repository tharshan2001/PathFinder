// models/schemas/certification.js
import mongoose from "mongoose";

export const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, default: "" },
    issueDate: { type: Date },
    credentialUrl: { type: String, default: "" }
  },
  { _id: true }
);
