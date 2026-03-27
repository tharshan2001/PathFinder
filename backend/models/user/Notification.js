import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: ["job", "course", "connection", "application", "message", "system", "achievement"],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String }, // URL to navigate to
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who triggered it
  metadata: { type: mongoose.Schema.Types.Mixed }, // Extra data
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
