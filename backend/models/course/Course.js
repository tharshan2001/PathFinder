import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    provider: { type: String, required: true, trim: true },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    skillsCovered: [{ type: String, required: true, trim: true }],
    location: { type: String, default: "Online" },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ skillsCovered: 1 });
export default mongoose.model("Course", courseSchema);