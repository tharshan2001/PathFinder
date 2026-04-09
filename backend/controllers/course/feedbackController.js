import mongoose from "mongoose";
import Course from "../../models/course/Course.js";
import Enrollment from "../../models/course/Enrollment.js";
import Feedback from "../../models/course/Feedback.js";
import { isAdminUser } from "../../utils/adminAuth.js";

const recalculateCourseRatings = async (courseId) => {
  const stats = await Feedback.aggregate([
    { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: "$courseId",
        ratingAvg: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  const ratingAvg = stats[0]?.ratingAvg || 0;
  const ratingCount = stats[0]?.ratingCount || 0;

  await Course.findByIdAndUpdate(courseId, {
    ratingAvg: Number(ratingAvg.toFixed(2)),
    ratingCount,
  });
};

// GET /api/courses/:courseId/feedback
export const getCourseFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const feedback = await Feedback.find({ courseId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:courseId/feedback/me
export const getMyCourseFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const feedback = await Feedback.findOne({ courseId, userId });
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

// POST /api/courses/:courseId/feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be a number between 1 and 5" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: { $ne: "dropped" },
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Only enrolled users can leave feedback for this course",
      });
    }

    const exists = await Feedback.findOne({ userId, courseId });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Feedback already exists for this course. Use update instead." });
    }

    const feedback = await Feedback.create({
      userId,
      courseId,
      rating,
      comment,
    });

    await recalculateCourseRatings(courseId);

    const populated = await feedback.populate("userId", "name email");
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Feedback already exists for this course. Use update instead." });
    }
    next(err);
  }
};

// PUT /api/courses/:courseId/feedback/:feedbackId
export const updateFeedback = async (req, res, next) => {
  try {
    const { courseId, feedbackId } = req.params;
    const userId = req.user?.id;
    const { rating, comment } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback || String(feedback.courseId) !== String(courseId)) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (String(feedback.userId) !== String(userId)) {
      return res.status(403).json({ message: "You can only update your own feedback" });
    }

    if (rating !== undefined) {
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "rating must be a number between 1 and 5" });
      }
      feedback.rating = rating;
    }

    if (comment !== undefined) {
      feedback.comment = comment;
    }

    await feedback.save();
    await recalculateCourseRatings(courseId);

    const populated = await feedback.populate("userId", "name email");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:courseId/feedback/:feedbackId
export const deleteFeedback = async (req, res, next) => {
  try {
    const { courseId, feedbackId } = req.params;
    const userId = req.user?.id;
    const isAdmin = isAdminUser(req.user);

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback || String(feedback.courseId) !== String(courseId)) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (!isAdmin && String(feedback.userId) !== String(userId)) {
      return res.status(403).json({ message: "You can only delete your own feedback" });
    }

    await Feedback.findByIdAndDelete(feedbackId);
    await recalculateCourseRatings(courseId);

    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    next(err);
  }
};
