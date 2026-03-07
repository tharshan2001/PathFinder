import Course from "../../models/course/Course.js";
import { getSkillGapAnalysis } from "../../services/analytics/analytics.service.js";

export const recommendCoursesForMissingSkills = async (userId) => {

    const gapData = await getSkillGapAnalysis(userId);
    const missingSkills = gapData?.missingSkills || [];

    if (!Array.isArray(missingSkills) || !missingSkills.length) {
        return [];
    }

    const recommendedCourses = [];


    for (const skill of missingSkills) {
        const skillName = typeof skill === "string" ? skill : skill?.name;
        if (!skillName) continue;

        const courses = await Course.find({
            skillsCovered: { $regex: new RegExp(`^${skillName}$`, "i") },
        })
            .sort({ ratingAvg: -1, ratingCount: -1 })
            .limit(3);

        if (courses.length > 0) {
            recommendedCourses.push({
                skill: skillName,
                courses,
            });
        }
    }

    return recommendedCourses;
};