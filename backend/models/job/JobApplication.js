import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    // Application References
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    // Application Status
    status: {
      type: String,
      enum: ["submitted", "under_review", "screening", "interview_scheduled", "interviewed", "offer_extended", "accepted", "rejected", "withdrawn"],
      default: "submitted"
    },
    
    // Application Details
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    expectedSalary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" }
    },
    
    // Application Metadata
    appliedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    
    // Recruiter Actions
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewDate: { type: Date },
    reviewNotes: { type: String, default: "" },
    
    // Interview Details
    interviewSchedule: {
      date: { type: Date },
      type: { 
        type: String, 
        enum: ["phone", "video", "onsite", "technical", "behavioral"] 
      },
      location: { type: String },
      notes: { type: String }
    },
    
    // Communication History
    communications: [{
      date: { type: Date, default: Date.now },
      type: {
        type: String,
        enum: ["email", "phone", "portal", "other"]
      },
      subject: { type: String },
      message: { type: String },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }],
    
    // Application Source
    source: {
      type: String,
      enum: ["direct", "linkedin", "indeed", "referral", "company_website", "other"],
      default: "direct"
    },
    
    // Analytics
    viewCount: { type: Number, default: 0 },
    
    // Additional Documents
    additionalDocuments: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, default: "document" }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for days since application
jobApplicationSchema.virtual("daysSinceApplied").get(function() {
  return Math.floor((Date.now() - this.appliedDate) / (1000 * 60 * 60 * 24));
});

// Virtual for current stage
jobApplicationSchema.virtual("currentStage").get(function() {
  const stageMap = {
    "submitted": "Application Submitted",
    "under_review": "Under Review",
    "screening": "Screening",
    "interview_scheduled": "Interview Scheduled",
    "interviewed": "Interview Completed",
    "offer_extended": "Offer Extended",
    "accepted": "Offer Accepted",
    "rejected": "Rejected",
    "withdrawn": "Withdrawn"
  };
  return stageMap[this.status] || "Unknown";
});

// Indexes for performance
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
jobApplicationSchema.index({ applicant: 1, status: 1 });
jobApplicationSchema.index({ job: 1, status: 1 });
jobApplicationSchema.index({ appliedDate: -1 });
jobApplicationSchema.index({ status: 1, lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
jobApplicationSchema.pre("save", function() {
  if (this.isModified("status")) {
    this.lastUpdated = new Date();
  }
});

export default mongoose.model("JobApplication", jobApplicationSchema);
