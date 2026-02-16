import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    message: { type: String } // optional note
  },
  { timestamps: true }
);

// Ensure one connection exists per pair (no duplicates)
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index to speed up fetching pending requests
connectionSchema.index({ recipient: 1, status: 1 });

export default mongoose.model("Connection", connectionSchema);
