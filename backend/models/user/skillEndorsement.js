// models/schemas/skillEndorsement.js
import mongoose from "mongoose";

export const skillEndorsementSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    endorsementsCount: { type: Number, default: 0 }
  },
  { _id: false }
);
