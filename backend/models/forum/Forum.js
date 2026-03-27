import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isAccepted: { type: Boolean, default: false }
}, { timestamps: true });

const forumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Web Development", "Data Science", "Cloud Computing", "Career Advice", "General"],
    default: "General" 
  },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  replies: [replySchema],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

forumSchema.index({ title: "text", content: "text" });
forumSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model("Forum", forumSchema);
