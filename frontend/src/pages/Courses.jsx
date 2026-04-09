import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../stores/authStore";
import {
  createFeedback,
  deleteFeedback,
  enrollInCourse,
  getCourseFeedback,
  getCourses,
  getMyEnrollments,
  updateEnrollmentProgress,
  updateFeedback,
} from "../services/courseApi";
import { BookOpen, Star, UserRound } from "lucide-react";

const emptyForm = { rating: 5, comment: "" };

const renderStars = (rating = 0) => {
  const fullStars = Math.round(rating);
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      size={16}
      className={index < fullStars ? "text-amber-500 fill-amber-500" : "text-gray-300"}
    />
  ));
};

const Courses = () => {
  const [searchParams] = useSearchParams();
  const selectedCourseId = searchParams.get('courseId');
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({});
  const [feedbackByCourse, setFeedbackByCourse] = useState({});
  const [myFeedbackByCourse, setMyFeedbackByCourse] = useState({});
  const [formsByCourse, setFormsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const userId = user?._id;

  const loadCoursesPage = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const [coursesData, enrollmentData] = await Promise.all([
        getCourses(),
        getMyEnrollments(userId),
      ]);

      const enrollmentMap = {};
      enrollmentData.forEach((item) => {
        if (item?.courseId?._id) {
          enrollmentMap[item.courseId._id] = item;
        }
      });

      setCourses(coursesData);
      setEnrollmentsByCourse(enrollmentMap);

      const feedbackResponses = await Promise.all(
        coursesData.map(async (course) => {
          const feedback = await getCourseFeedback(course._id);
          return { courseId: course._id, feedback };
        })
      );

      const feedbackMap = {};
      const mineMap = {};
      const formsMap = {};

      feedbackResponses.forEach(({ courseId, feedback }) => {
        feedbackMap[courseId] = feedback;

        const mine = feedback.find((entry) => entry?.userId?._id === userId);
        if (mine) {
          mineMap[courseId] = mine;
          formsMap[courseId] = { rating: mine.rating, comment: mine.comment || "" };
        } else {
          formsMap[courseId] = { ...emptyForm };
        }
      });

      setFeedbackByCourse(feedbackMap);
      setMyFeedbackByCourse(mineMap);
      setFormsByCourse(formsMap);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesPage();
  }, [userId]);

  useEffect(() => {
    if (!selectedCourseId || loading) return;

    const target = document.getElementById(`course-${selectedCourseId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCourseId, loading, courses]);

  const enrolledCourseIds = useMemo(
    () => new Set(Object.keys(enrollmentsByCourse)),
    [enrollmentsByCourse]
  );

  const updateForm = (courseId, partial) => {
    setFormsByCourse((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || emptyForm),
        ...partial,
      },
    }));
  };

  const handleEnroll = async (courseId) => {
    if (!userId) return;

    const key = `enroll-${courseId}`;
    setActionLoading(key);
    setError("");

    try {
      const enrollment = await enrollInCourse(courseId, userId);
      const hydrated = {
        ...enrollment,
        courseId: { _id: courseId },
      };
      setEnrollmentsByCourse((prev) => ({ ...prev, [courseId]: hydrated }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll in course");
    } finally {
      setActionLoading("");
    }
  };

  const handleProgressUpdate = async (courseId, progressValue) => {
    const enrollment = enrollmentsByCourse[courseId];
    if (!enrollment?._id) return;

    const key = `progress-${courseId}`;
    setActionLoading(key);
    setError("");

    try {
      const updated = await updateEnrollmentProgress(enrollment._id, progressValue);
      setEnrollmentsByCourse((prev) => ({ ...prev, [courseId]: updated }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update progress");
    } finally {
      setActionLoading("");
    }
  };

  const handleSubmitFeedback = async (courseId) => {
    const form = formsByCourse[courseId] || emptyForm;
    const payload = {
      rating: Number(form.rating),
      comment: (form.comment || "").trim(),
    };

    const key = `feedback-${courseId}`;
    setActionLoading(key);
    setError("");

    try {
      const mine = myFeedbackByCourse[courseId];
      let saved;
      if (mine?._id) {
        saved = await updateFeedback(courseId, mine._id, payload);
      } else {
        saved = await createFeedback(courseId, payload);
      }

      setMyFeedbackByCourse((prev) => ({ ...prev, [courseId]: saved }));
      await loadCoursesPage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save feedback");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteFeedback = async (courseId) => {
    const mine = myFeedbackByCourse[courseId];
    if (!mine?._id) return;

    const key = `delete-feedback-${courseId}`;
    setActionLoading(key);
    setError("");

    try {
      await deleteFeedback(courseId, mine._id);
      await loadCoursesPage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete feedback");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Course Hub</h1>
          <p className="text-gray-600 mt-1">Enroll, track progress, and share your course feedback.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {courses.map((course) => {
              const courseId = course._id;
              const enrollment = enrollmentsByCourse[courseId];
              const isEnrolled = enrolledCourseIds.has(courseId);
              const feedbackList = feedbackByCourse[courseId] || [];
              const form = formsByCourse[courseId] || emptyForm;
              const mine = myFeedbackByCourse[courseId];

              return (
                <section
                  id={`course-${courseId}`}
                  key={courseId}
                  className={`bg-white rounded-xl border p-5 transition ${
                    selectedCourseId === courseId
                      ? 'border-teal-400 ring-2 ring-teal-100'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-teal-700 font-medium text-sm">
                        <BookOpen size={16} />
                        {course.category}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mt-1">{course.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{course.provider} • {course.level} • {course.location}</p>
                      <p className="text-sm text-gray-700 mt-3 max-w-3xl">{course.description}</p>
                    </div>

                    <div className="lg:text-right">
                      <div className="inline-flex items-center gap-1">{renderStars(course.ratingAvg)}</div>
                      <p className="text-sm text-gray-600 mt-1">
                        {Number(course.ratingAvg || 0).toFixed(1)} ({course.ratingCount || 0} reviews)
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    {!isEnrolled ? (
                      <button
                        onClick={() => handleEnroll(courseId)}
                        disabled={actionLoading === `enroll-${courseId}`}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
                      >
                        {actionLoading === `enroll-${courseId}` ? "Enrolling..." : "Enroll"}
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">Your progress: {enrollment.progress || 0}%</p>
                          <div className="mt-1 h-2.5 w-56 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {[25, 50, 75, 100].map((step) => (
                            <button
                              key={step}
                              onClick={() => handleProgressUpdate(courseId, step)}
                              disabled={actionLoading === `progress-${courseId}`}
                              className="px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                              {step}%
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <h3 className="font-semibold text-gray-900">Ratings & Feedback</h3>

                    {!isEnrolled ? (
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
                        Enroll in this course to add your rating and review.
                      </p>
                    ) : (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Rating</label>
                          <select
                            className="w-full mt-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                            value={form.rating}
                            onChange={(e) => updateForm(courseId, { rating: Number(e.target.value) })}
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>
                                {value} Star{value > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-xs text-gray-600">Comment</label>
                          <textarea
                            rows={3}
                            maxLength={1000}
                            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={form.comment}
                            onChange={(e) => updateForm(courseId, { comment: e.target.value })}
                            placeholder="Share what you learned and how useful this course is"
                          />
                        </div>
                      </div>
                    )}

                    {isEnrolled && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleSubmitFeedback(courseId)}
                          disabled={actionLoading === `feedback-${courseId}`}
                          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black disabled:opacity-60"
                        >
                          {actionLoading === `feedback-${courseId}`
                            ? "Saving..."
                            : mine
                              ? "Update Review"
                              : "Submit Review"}
                        </button>

                        {mine && (
                          <button
                            onClick={() => handleDeleteFeedback(courseId)}
                            disabled={actionLoading === `delete-feedback-${courseId}`}
                            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}

                    <div className="mt-4 space-y-3">
                      {feedbackList.length === 0 ? (
                        <p className="text-sm text-gray-500">No reviews yet.</p>
                      ) : (
                        feedbackList.map((item) => (
                          <article key={item._id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <UserRound size={14} />
                                <span>{item?.userId?.name || "Anonymous"}</span>
                              </div>
                              <div className="flex items-center gap-1">{renderStars(item.rating)}</div>
                            </div>
                            {item.comment && <p className="text-sm text-gray-700 mt-2">{item.comment}</p>}
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
