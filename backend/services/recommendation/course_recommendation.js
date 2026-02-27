import Course from "../../models/course/Course.js";
import { getSkillGapAnalysis } from "../../services/analytics/analytics.service.js";

export const recommendCoursesForMissingSkills = async (userId) => {

    //  Get skill gap data
    const gapData = await getSkillGapAnalysis(userId);

    const missingSkills = gapData.missingSkills;

    if (!missingSkills.length) {
        return [];
    }

    const recommendedCourses = [];

    for (const skill of missingSkills) {

        const courses = await Course.find({
            "skillsCovered.name": { $regex: new RegExp(`^${skill.name}$`, "i") }
        })
            .sort({ ratingAvg: -1, ratingCount: -1 })
            .limit(3);

        if (courses.length > 0) {
            recommendedCourses.push({
                skill: skill.name,
                courses
            });
        }
    }

    return recommendedCourses;
};