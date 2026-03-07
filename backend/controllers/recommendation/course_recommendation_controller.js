import { recommendCoursesForMissingSkills } from "../../services/recommendation/course_recommendation.js";

export const recommendCoursesForGap = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const courses = await recommendCoursesForMissingSkills(userId);

        res.status(200).json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error("Course Recommendation Failed:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};