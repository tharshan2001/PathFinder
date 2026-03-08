import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema(
  {
    // Category Name and Description
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    
    // Category Type
    type: {
      type: String,
      enum: ["industry", "role", "location", "skill"],
      required: true
    },
    
    // Hierarchy Support
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      default: null
    },
    
    // Category Metadata
    icon: { type: String, default: "" },
    color: { type: String, default: "#007bff" },
    isActive: { type: Boolean, default: true },
    
    // Sorting and Display
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    
    // Analytics
    jobCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    
    // SEO
    // Note: slug is not unique at the database level to avoid
    // duplicate-key errors when using findOneAndUpdate with upsert.
    // If you need uniqueness, enforce it in application logic instead.
    slug: { type: String, lowercase: true },
    metaDescription: { type: String, default: "" }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for subcategories
jobCategorySchema.virtual("subcategories", {
  ref: "JobCategory",
  localField: "_id",
  foreignField: "parentCategory"
});

// Virtual for full path
jobCategorySchema.virtual("fullPath").get(function() {
  // This would need to be populated with parent categories
  return this.name;
});

// Indexes for performance
jobCategorySchema.index({ type: 1, isActive: 1 });
jobCategorySchema.index({ parentCategory: 1 });
jobCategorySchema.index({ slug: 1 });
jobCategorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug
jobCategorySchema.pre("save", function() {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export default mongoose.model("JobCategory", jobCategorySchema);
