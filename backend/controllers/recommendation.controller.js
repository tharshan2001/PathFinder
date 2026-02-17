import { recommendJobsForUser } from "../services/recommendation.service.js";

/**
 * @desc    Get recommended jobs for logged-in user
 * @route   GET /api/recommendations/jobs
 * @access  Private
 */
export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.user.id; // extracted from JWT middleware

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
