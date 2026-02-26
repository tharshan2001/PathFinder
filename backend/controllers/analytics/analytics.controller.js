import { getSkillGapAnalysis } from "../../services/analytics/analytics.service.js";

export const skillGapAnalysis = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        const analysis = await getSkillGapAnalysis(userId);

        res.status(200).json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error("Skill Gap Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};