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
export const addSkill = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { name, level } = req.body;

        const profile = await UserSkillProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Skill profile not found"
            });
        }

        profile.skills.push({ name, level });
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