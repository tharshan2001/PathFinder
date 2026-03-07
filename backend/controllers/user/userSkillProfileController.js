import UserSkillProfile from "../../models/user/userSkillProfile.js";

export const createSkillProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills } = req.body;

        // prevent duplicate profiles
        const existingProfile = await UserSkillProfile.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Skill profile already exists"
            });
        }

        const profile = await UserSkillProfile.create({
            userId: userId,
            skills
        });

        res.status(201).json({
            success: true,
            data: profile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};