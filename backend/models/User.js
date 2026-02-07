// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Identity
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin", "mentor"],
      default: "user"
    },

    // Professional Profile (LinkedIn-like)
    headline: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    about: {
      type: String,
      default: ""
    },

    // Skills & Learning
    skills: [
      {
        type: String,
        trim: true
      }
    ],

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    learningPreferences: [
      {
        type: String
      }
    ],

    // Counts (IMPORTANT – no heavy arrays)
    connectionsCount: {
      type: Number,
      default: 0
    },

    profileViews: {
      type: Number,
      default: 0
    },

    // Saved Items
    savedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],

    // Career Status
    isOpenToWork: {
      type: Boolean,
      default: false
    },

    // Account State
    isActive: {
      type: Boolean,
      default: true
    },

    lastActiveAt: {
      type: Date
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

export default mongoose.model("User", userSchema);
