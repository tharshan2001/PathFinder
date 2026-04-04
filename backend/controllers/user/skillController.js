import User from "../../models/user/User.js";

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add skill
export const addSkill = async (req, res) => {
  try {
    const { skill, level } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills.push({ skill, level: level || 'Intermediate', endorsementsCount: 0 });
    await user.save();

    res.json({ message: "Skill added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { skillName } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills = user.skills.filter(s => s.skill !== skillName);
    await user.save();

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
