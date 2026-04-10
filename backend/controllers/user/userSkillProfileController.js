import UserSkillProfile from "../../models/user/userSkillProfile.js";

/* CREATE */
export const createSkillProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { skills } = req.body;

        const existingProfile = await UserSkillProfile.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Skill profile already exists"
            });
        }

        const profile = await UserSkillProfile.create({
            userId,
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


/* READ (Get logged user profile) */
export const getMySkillProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const profile = await UserSkillProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Skill profile not found"
            });
        }

        res.status(200).json({
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


/* UPDATE entire profile */
export const updateSkillProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { skills } = req.body;

        const profile = await UserSkillProfile.findOneAndUpdate(
            { userId },
            { skills },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Skill profile not found"
            });
        }

        res.status(200).json({
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


/* ADD NEW SKILL */
// Add skill to profile
export const addSkill = async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Skills array is required"
            });
        }

        const userId = req.user.id;

        let profile = await UserSkillProfile.findOne({ userId });
        const existingSkillNames = new Set(
            (profile?.skills || []).map((skill) => String(skill.name || "").trim().toLowerCase())
        );

        const incomingSkillNames = new Set();
        const normalizedIncomingSkills = [];

        for (const skill of skills) {
            const skillName = String(skill?.name || "").trim();
            const skillLevel = skill?.level;

            if (!skillName || !skillLevel) {
                return res.status(400).json({
                    success: false,
                    message: "Each skill must include name and level"
                });
            }

            const normalizedName = skillName.toLowerCase();
            if (existingSkillNames.has(normalizedName) || incomingSkillNames.has(normalizedName)) {
                return res.status(409).json({
                    success: false,
                    message: `Skill '${skillName}' already exists in profile`
                });
            }

            incomingSkillNames.add(normalizedName);
            normalizedIncomingSkills.push({ name: skillName, level: skillLevel });
        }

        if (!profile) {
            profile = new UserSkillProfile({
                userId,
                skills: normalizedIncomingSkills
            });
        } else {
            profile.skills.push(...normalizedIncomingSkills);
        }

        await profile.save();

        res.json({
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


/* UPDATE SINGLE SKILL */
export const updateSkill = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { skillName } = req.params;
        const { level } = req.body;

        const profile = await UserSkillProfile.findOne({ userId });

        const skill = profile.skills.find(
            s => s.name.toLowerCase() === skillName.toLowerCase()
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        skill.level = level;
        await profile.save();

        res.status(200).json({
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


/* DELETE SKILL */
export const deleteSkill = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { skillName } = req.params;

        const profile = await UserSkillProfile.findOne({ userId });

        profile.skills = profile.skills.filter(
            skill => skill.name.toLowerCase() !== skillName.toLowerCase()
        );

        await profile.save();

        res.status(200).json({
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


/* DELETE ENTIRE PROFILE */
export const deleteSkillProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        await UserSkillProfile.findOneAndDelete({ userId });

        res.status(200).json({
            success: true,
            message: "Skill profile deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};