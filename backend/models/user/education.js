// models/schemas/education.js
import mongoose from "mongoose";

export const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startYear: { type: Number },
    endYear: { type: Number },
    grade: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  { _id: true }
);
