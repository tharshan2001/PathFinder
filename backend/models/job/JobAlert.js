import mongoose from "mongoose";

const jobAlertSchema = new mongoose.Schema(
  {
    // Alert Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    // Alert Configuration
    title: { type: String, required: true, trim: true },
    
    // Search Criteria
    keywords: [{ type: String }],
    location: { type: String, default: "" },
    remotePolicy: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote", "Remote-friendly", "any"],
      default: "any"
    },
    
    // Job Categories
    industries: [{ type: String }],
    roles: [{ type: String }],
    levels: [{
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior", "Lead", "Manager", "Director"]
    }],
    employmentTypes: [{
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"]
    }],
    
    // Salary Range
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" }
    },
    
    // Skills
    skills: [{ type: String }],
    
    // Companies
    companies: [{ type: String }],
    
    // Alert Settings
    isActive: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ["instant", "daily", "weekly"],
      default: "daily"
    },
    
    // Notification Preferences
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    
    // Alert Metadata
    lastRun: { type: Date },
    nextRun: { type: Date },
    
    // Analytics
    totalMatches: { type: Number, default: 0 },
    lastMatchCount: { type: Number, default: 0 },
    
    // Exclusions
    excludeKeywords: [{ type: String }],
    excludeCompanies: [{ type: String }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for next run time
jobAlertSchema.virtual("nextRunDisplay").get(function() {
  if (!this.nextRun) return "Not scheduled";
  const now = new Date();
  const diff = this.nextRun - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return "Soon";
});

// Indexes for performance
jobAlertSchema.index({ user: 1, isActive: 1 });
jobAlertSchema.index({ nextRun: 1, isActive: 1 });
jobAlertSchema.index({ frequency: 1 });

// Pre-save middleware to set next run time
jobAlertSchema.pre("save", function() {
  if (this.isNew || this.isModified("frequency") || this.isModified("isActive")) {
    if (this.isActive) {
      const now = new Date();
      switch (this.frequency) {
        case "instant":
          this.nextRun = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
          break;
        case "daily":
          this.nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
          break;
        case "weekly":
          this.nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
          break;
      }
    } else {
      this.nextRun = null;
    }
  }
});

export default mongoose.model("JobAlert", jobAlertSchema);
