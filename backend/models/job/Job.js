import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Basic Job Information
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    
    // Job Classification
    category: {
      industry: { type: String, required: true },
      role: { type: String, required: true },
      level: { 
        type: String, 
        enum: ["Entry-level", "Mid-level", "Senior", "Lead", "Manager", "Director"],
        required: true 
      }
    },
    
    // Employment Details
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"],
      required: true
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" }
    },
    
    // Skills & Requirements
      skillsRequired: [
          {
              name: { type: String, required: true },
              level: {
                  type: String,
                  enum: ["Beginner", "Intermediate", "Advanced"],
                  default: "Beginner"
              }
          }
      ],
    experienceRequired: { type: String, default: "" },
    educationRequired: { type: String, default: "" },
    
    // Job Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    // Application Settings
    applicationDeadline: { type: Date },
    applicationUrl: { type: String },
    applyViaEmail: { type: String },
    
    // Company Information
    companyDescription: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companySize: { type: String, default: "" },
    
    // Metadata
    postedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    postedDate: { type: Date, default: Date.now },
    
    // Analytics
    viewsCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    
    // SEO & Search
    tags: [{ type: String }],
    
    // Location Details
    remotePolicy: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote", "Remote-friendly"],
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for days since posting
jobSchema.virtual("daysPosted").get(function() {
  return Math.floor((Date.now() - this.postedDate) / (1000 * 60 * 60 * 24));
});

// Virtual for salary range display
jobSchema.virtual("salaryRange").get(function() {
  if (this.salary.min && this.salary.max) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()}`;
  } else if (this.salary.min) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()}+`;
  }
  return "Competitive";
});

// Index for better search performance
jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ "category.industry": 1, "category.role": 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ skillsRequired: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ isActive: 1, isFeatured: 1 });

export default mongoose.model("Job", jobSchema);
