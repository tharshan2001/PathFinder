// models/User.js
import mongoose from "mongoose";

// Import all sub-schemas
import { experienceSchema } from "./schemas/experience.js";
import { educationSchema } from "./schemas/education.js";
import { projectSchema } from "./schemas/project.js";
import { certificationSchema } from "./schemas/certification.js";
import { socialLinksSchema } from "./schemas/socialLinks.js";
import { connectionRefSchema } from "./schemas/connectionRef.js";
import { profileMediaSchema } from "./schemas/profileMedia.js";
import { careerPreferencesSchema } from "./schemas/careerPreferences.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Identity
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "mentor"], default: "user" },

    // Professional Profile
    headline: { type: String, maxlength: 120, default: "" },
    about: { type: String, maxlength: 2000, default: "" },
    location: { type: String, default: "" },

    // Media
    profileMedia: profileMediaSchema,

    // Experience & Education
    experience: [experienceSchema],
    education: [educationSchema],

    // Skills
    skills: [skillEndorsementSchema],

    // Projects & Certifications
    projects: [projectSchema],
    certifications: [certificationSchema],

    // Social Links
    socialLinks: socialLinksSchema,

    // Connections (lightweight)
    connectionsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    connections: [connectionRefSchema], // optional snapshot

    // Career Preferences
    careerPreferences: careerPreferencesSchema,

    // Profile Activity
    profileViews: { type: Number, default: 0 },
    lastActiveAt: { type: Date },

    // Saved Items
    savedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Account State
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

export default mongoose.model("User", userSchema);
