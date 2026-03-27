import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["video", "article", "quiz", "project"], default: "video" },
  duration: { type: Number, default: 0 }, // in minutes
  content: String, // URL or content
  order: { type: Number, default: 0 }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: String,
  category: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
  skills: [{ type: String }],
  modules: [moduleSchema],
  duration: { type: Number, default: 0 }, // total hours
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Virtual for progress (per user)
learningPathSchema.virtual("enrolledCount").get(function() {
  return this.enrolledUsers?.length || 0;
});

export default mongoose.model("LearningPath", learningPathSchema);
