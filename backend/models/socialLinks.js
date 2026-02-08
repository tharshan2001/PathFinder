// models/schemas/socialLinks.js
import mongoose from "mongoose";

export const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    twitter: { type: String, default: "" }
  },
  { _id: false }
);
