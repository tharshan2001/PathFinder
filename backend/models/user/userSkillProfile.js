import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            required: true,
        },
    },
    { _id: false },
);

export const userSkillProfileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true ,unique: true},
        skills: { type: [userSkillSchema], default: [] },
    },
    { timestamps: true }
);
export default mongoose.model("UserSkillProfile", userSkillProfileSchema);