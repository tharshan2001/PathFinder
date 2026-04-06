import Enrollment from "../../models/course/Enrollment.js";
import Course from "../../models/course/Course.js";

// POST /api/enrollments/enroll/:courseId
export const enrollInCourse = async (req, res, next) => {
  try {
    const { userId } = req.body;  // from body temporarily
    const { courseId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      status: "enrolled",
      progress: 0,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }
    next(err);
  }
};

// GET /api/enrollments/user/:userId
export const getMyEnrollments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const enrollments = await Enrollment.find({ userId })
      .populate("courseId")
      .sort({ updatedAt: -1 });

    res.json(enrollments);
  } catch (err) {
    next(err);
  }
};

// PUT /api/enrollments/progress/:enrollmentId
export const updateProgress = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({ message: "progress is required" });
    }
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "progress must be 0-100" });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    enrollment.progress = progress;

    if (progress === 100) enrollment.status = "completed";

    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};