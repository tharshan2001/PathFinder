// models/schemas/connectionRef.js
import mongoose from "mongoose";

export const connectionRefSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    connectedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);
