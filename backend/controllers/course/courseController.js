import Course from "../../models/course/Course.js";

const normalizeSkills = (skillsCovered) => {
  if (Array.isArray(skillsCovered)) {
    return skillsCovered
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  if (typeof skillsCovered === "string") {
    return skillsCovered
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeUrl = (value) => String(value || "").trim();

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_error) {
    return false;
  }
};

// GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, industry, skill, level, location } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (industry) filter.category = industry;
    if (level) filter.level = level;
    if (location) filter.location = location;
    if (skill) filter.skillsCovered = { $in: [skill] };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsCovered: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/meta/options
export const getCourseMetaOptions = async (req, res, next) => {
  try {
    const [industries, levels, skills] = await Promise.all([
      Course.distinct("category"),
      Course.distinct("level"),
      Course.distinct("skillsCovered"),
    ]);

    res.json({
      industries: industries.filter(Boolean).sort(),
      levels: levels.filter(Boolean).sort(),
      skills: skills.filter(Boolean).sort(),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// POST /api/courses
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      category,
      industry,
      description,
      provider,
      courseUrl,
      skillsCovered,
      level,
      location,
    } = req.body;

    const normalizedSkills = normalizeSkills(skillsCovered);
    const normalizedCategory = industry || category;
    const normalizedCourseUrl = normalizeUrl(courseUrl);

    if (
      !title ||
      !normalizedCategory ||
      !description ||
      !provider ||
      !normalizedCourseUrl ||
      normalizedSkills.length === 0 ||
      !level
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidHttpUrl(normalizedCourseUrl)) {
      return res.status(400).json({ message: "courseUrl must be a valid http/https URL" });
    }

    const course = await Course.create({
      title,
      category: normalizedCategory,
      description,
      provider,
      courseUrl: normalizedCourseUrl,
      skillsCovered: normalizedSkills,
      level,
      location,
    });

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.industry && !payload.category) {
      payload.category = payload.industry;
    }

    if (payload.skillsCovered !== undefined) {
      payload.skillsCovered = normalizeSkills(payload.skillsCovered);
    }

    if (payload.courseUrl !== undefined) {
      payload.courseUrl = normalizeUrl(payload.courseUrl);
      if (!payload.courseUrl || !isValidHttpUrl(payload.courseUrl)) {
        return res.status(400).json({ message: "courseUrl must be a valid http/https URL" });
      }
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    next(err);
  }
};