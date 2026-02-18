import mongoose from "mongoose";

const trendingSkillsSchema = new mongoose.Schema(
  {
    // Skill Information
    skill: { type: String, required: true, unique: true, trim: true },
    
    // Demand Metrics
    demandScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    
    // Job Market Data
    jobCount: { type: Number, default: 0 },
    averageSalary: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: "USD" },
    
    // Growth Metrics
    growthRate: { type: Number, default: 0 }, // percentage change
    trendDirection: {
      type: String,
      enum: ["rising", "stable", "declining"],
      default: "stable"
    },
    
    // Category Information
    category: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    
    // Location Data
    topLocations: [{
      location: { type: String, required: true },
      demandScore: { type: Number, default: 0 },
      averageSalary: { type: Number, default: 0 }
    }],
    
    // Industry Data
    topIndustries: [{
      industry: { type: String, required: true },
      demandScore: { type: Number, default: 0 },
      averageSalary: { type: Number, default: 0 }
    }],
    
    // Related Skills
    relatedSkills: [{ type: String }],
    
    // Time Series Data
    historicalData: [{
      date: { type: Date, required: true },
      demandScore: { type: Number, default: 0 },
      jobCount: { type: Number, default: 0 },
      averageSalary: { type: Number, default: 0 }
    }],
    
    // Metadata
    lastUpdated: { type: Date, default: Date.now },
    dataPoints: { type: Number, default: 0 }, // number of data points analyzed
    
    // Skill Classification
    skillType: {
      type: String,
      enum: ["technical", "soft", "domain", "tool", "language", "framework"],
      default: "technical"
    },
    
    // Experience Level Demand
    experienceLevelDemand: {
      entry: { type: Number, default: 0 },
      mid: { type: Number, default: 0 },
      senior: { type: Number, default: 0 },
      lead: { type: Number, default: 0 }
    },
    
    // Remote Work Demand
    remoteDemandScore: { type: Number, default: 0 },
    
    // Certifications Related
    relatedCertifications: [{ type: String }],
    
    // Learning Resources
    popularCourses: [{
      title: { type: String },
      provider: { type: String },
      rating: { type: Number },
      enrollmentCount: { type: Number }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for trend indicator
trendingSkillsSchema.virtual("trendIndicator").get(function() {
  if (this.growthRate > 10) return "🔥 Hot";
  if (this.growthRate > 5) return "📈 Rising";
  if (this.growthRate < -5) return "📉 Declining";
  return "➡️ Stable";
});

// Virtual for salary range
trendingSkillsSchema.virtual("salaryRange").get(function() {
  if (!this.averageSalary) return "Not available";
  const min = Math.round(this.averageSalary * 0.8);
  const max = Math.round(this.averageSalary * 1.2);
  return `${this.salaryCurrency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
});

// Indexes for performance
trendingSkillsSchema.index({ skill: 1 }, { unique: true });
trendingSkillsSchema.index({ demandScore: -1 });
trendingSkillsSchema.index({ growthRate: -1 });
trendingSkillsSchema.index({ category: 1, demandScore: -1 });
trendingSkillsSchema.index({ skillType: 1, demandScore: -1 });
trendingSkillsSchema.index({ lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
trendingSkillsSchema.pre("save", function(next) {
  if (this.isModified("demandScore") || this.isModified("jobCount")) {
    this.lastUpdated = new Date();
    this.dataPoints += 1;
  }
  next();
});

// Static method to get trending skills
trendingSkillsSchema.statics.getTrending = function(limit = 20, category = null) {
  const query = category ? { category } : {};
  return this.find(query)
    .sort({ demandScore: -1, growthRate: -1 })
    .limit(limit)
    .populate("relatedSkills");
};

// Static method to get skills by location
trendingSkillsSchema.statics.getSkillsByLocation = function(location, limit = 10) {
  return this.find({
    "topLocations.location": location
  })
  .sort({ "topLocations.demandScore": -1 })
  .limit(limit);
};

export default mongoose.model("TrendingSkills", trendingSkillsSchema);
