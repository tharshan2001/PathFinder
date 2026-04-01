import { recommendJobsForUser } from "../../services/recommendation/recommendation.js";

export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        const jobs = await recommendJobsForUser(userId);

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });

    } catch (error) {
        console.error("Recommendation Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};
