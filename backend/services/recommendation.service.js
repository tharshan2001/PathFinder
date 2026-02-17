import Job from "../models/job/Job.js";
import UserSkillProfile from "../models/user/userSkillProfile.js";

const levelWeight = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
};

export const recommendJobsForUser = async (userId) => {

    const profile = await UserSkillProfile.findOne({ userId });

    if (!profile) {
        throw new Error("User skill profile not found");
    }

    const jobs = await Job.find({ isActive: true });

    const recommendations = jobs.map(job => {

        let score = 0;
        let maxScore = job.skillsRequired.length * 2;

        job.skillsRequired.forEach(requiredSkill => {

            const userSkill = profile.skills.find(
                skill => skill.name.toLowerCase() === requiredSkill.name.toLowerCase()
            );

            if (userSkill) {
                const userLevel = levelWeight[userSkill.level];
                const requiredLevel = levelWeight[requiredSkill.level];

                if (userLevel >= requiredLevel) {
                    score += 2;
                } else {
                    score += 1;
                }
            }
        });

        const matchPercentage = maxScore === 0
            ? 0
            : Math.round((score / maxScore) * 100);

        return {
            ...job.toObject(),
            matchPercentage
        };
    });

    return recommendations
        .filter(job => job.matchPercentage >= 40)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);
};
