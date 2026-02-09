// models/User.js
import mongoose from "mongoose";

// Import sub-schemas
import { experienceSchema } from "../user/experience.js";
import { educationSchema } from "../user/education.js";
import { projectSchema } from "../user/project.js";
import { certificationSchema } from "../user/certification.js";
import { socialLinksSchema } from "../user/socialLinks.js";
import { profileMediaSchema } from "../user/profileMedia.js";
import { careerPreferencesSchema } from "../user/careerPreferences.js";
import { skillEndorsementSchema } from "../user/skillEndorsement.js";

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

    // Connection counters (source of truth = Connection collection)
    connectionsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },

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
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
