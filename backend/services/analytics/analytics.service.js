import Job from "../../models/job/Job.js";
import UserSkillProfile from "../../models/user/userSkillProfile.js";

export const getSkillGapAnalysis = async (userId) => {

    //  Get user profile
    const profile = await UserSkillProfile.findOne({ userId });

    if (!profile) {
        throw new Error("User skill profile not found");
    }

    const userSkills = profile.skills;

    //  Fetch active jobs only
    const jobs = await Job.find({ isActive: true });

    //  Build market skill frequency map
    const skillFrequency = {};

    jobs.forEach(job => {
        job.skillsRequired.forEach(skillObj => {
            const skillName = skillObj.name.toLowerCase();

            if (!skillFrequency[skillName]) {
                skillFrequency[skillName] = 1;
            } else {
                skillFrequency[skillName] += 1;
            }
        });
    });

    //  Convert to sorted array
    const sortedSkills = Object.entries(skillFrequency)
        .map(([name, count]) => ({ name, demandCount: count }))
        .sort((a, b) => b.demandCount - a.demandCount);

    // Top 10 demanded skills
    const topMarketSkills = sortedSkills.slice(0, 10);

    //  Compare with user skills
    const missingSkills = [];
    const weakSkills = [];

    const levelWeight = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3,
    };

    topMarketSkills.forEach(marketSkill => {

        const userSkill = userSkills.find(
            s => s.name.toLowerCase() === marketSkill.name
        );

        if (!userSkill) {
            // User doesn't have this skill
            missingSkills.push(marketSkill);
        } else {
            // Compare level vs job requirement average
            const relatedJobs = jobs.filter(job =>
                job.skillsRequired.some(
                    skill => skill.name.toLowerCase() === marketSkill.name
                )
            );

            let totalLevel = 0;
            let count = 0;

            relatedJobs.forEach(job => {
                job.skillsRequired.forEach(skill => {
                    if (skill.name.toLowerCase() === marketSkill.name) {
                        totalLevel += levelWeight[skill.level];
                        count++;
                    }
                });
            });

            const avgRequiredLevel = count ? totalLevel / count : 1;

            if (levelWeight[userSkill.level] < avgRequiredLevel) {
                weakSkills.push({
                    name: marketSkill.name,
                    recommendedLevel:
                        avgRequiredLevel >= 2.5
                            ? "Advanced"
                            : avgRequiredLevel >= 1.5
                                ? "Intermediate"
                                : "Beginner"
                });
            }
        }
    });

    //  Calculate Gap Score
    const gapScore = (missingSkills.length * 2) + weakSkills.length;

    return {
        userSkills,
        topMarketSkills,
        missingSkills,
        weakSkills,
        gapScore
    };
};