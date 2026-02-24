import Course from "../../models/course/Course.js";

// GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, location } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (location) filter.location = location;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
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
    const { title, category, description, provider, level, location } = req.body;

    if (!title || !category || !description || !provider || !level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.create({
      title,
      category,
      description,
      provider,
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
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
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