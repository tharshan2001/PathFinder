// models/schemas/project.js
import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    projectUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" }
  },
  { _id: false }
);
