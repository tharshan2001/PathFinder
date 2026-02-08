// models/schemas/profileMedia.js
import mongoose from "mongoose";

export const profileMediaSchema = new mongoose.Schema(
  {
    profileImage: { type: String, default: "" },
    coverImage: { type: String, default: "" }
  },
  { _id: false }
);
