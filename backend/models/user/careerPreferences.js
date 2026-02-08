// models/schemas/careerPreferences.js
import mongoose from "mongoose";

export const careerPreferencesSchema = new mongoose.Schema(
  {
    isOpenToWork: { type: Boolean, default: false },
    openToRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    jobTypes: {
      type: [String],
      enum: ["Remote", "Hybrid", "Onsite"],
      default: []
    }
  },
  { _id: false }
);
