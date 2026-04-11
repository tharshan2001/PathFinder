import { useEffect, useState } from "react";
import { Edit3, ExternalLink, ShieldCheck, Trash2, UserRound } from "lucide-react";
import Navbar from "../components/Navbar";
import {
  createCourse,
  deleteCourse,
  deleteFeedback,
  getCourseFeedback,
  getCourses,
  updateCourse,
} from "../services/courseApi";
import { useAuthStore } from "../stores/authStore";
import { isAdminUser } from "../utils/adminAuth";

const emptyCourseForm = {
  title: "",
  category: "",
  description: "",
  provider: "",
  courseUrl: "",
  level: "Beginner",
  location: "Online",
  skillsInput: "",
};

const CourseAdmin = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [feedbackByCourse, setFeedbackByCourse] = useState({});
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = isAdminUser(user);

  const loadAdminData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const coursesData = await getCourses();
      setCourses(coursesData);

      const feedbackResponses = await Promise.all(
        coursesData.map(async (course) => {
          const feedback = await getCourseFeedback(course._id);
          return { courseId: course._id, feedback };
        })
      );

      const map = {};
      feedbackResponses.forEach(({ courseId, feedback }) => {
        map[courseId] = feedback;
      });

      setFeedbackByCourse(map);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const updateCourseForm = (partial) => {
    setCourseForm((prev) => ({ ...prev, ...partial }));
  };

  const resetCourseForm = () => {
    setCourseForm(emptyCourseForm);
    setEditingCourseId("");
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();

    const payload = {
      title: courseForm.title.trim(),
      category: courseForm.category.trim(),
      description: courseForm.description.trim(),
      provider: courseForm.provider.trim(),
      courseUrl: courseForm.courseUrl.trim(),
      level: courseForm.level,
      location: courseForm.location.trim() || "Online",
      skillsCovered: courseForm.skillsInput,
    };

    if (
      !payload.title ||
      !payload.category ||
      !payload.provider ||
      !payload.description ||
      !payload.courseUrl ||
      !payload.skillsCovered
    ) {
      setError("Please fill all required fields, including course link.");
      return;
    }

    const key = editingCourseId ? `update-course-${editingCourseId}` : "create-course";
    setActionLoading(key);
    setError("");
    setSuccess("");

    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, payload);
        setSuccess("Course updated successfully.");
      } else {
        await createCourse(payload);
        setSuccess("Course created successfully.");
      }

      resetCourseForm();
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    } finally {
      setActionLoading("");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || "",
      category: course.category || "",
      description: course.description || "",
      provider: course.provider || "",
      courseUrl: course.courseUrl || "",
      level: course.level || "Beginner",
      location: course.location || "Online",
      skillsInput: Array.isArray(course.skillsCovered) ? course.skillsCovered.join(", ") : "",
    });
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm("Delete this course? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    const key = `delete-course-${courseId}`;
    setActionLoading(key);
    setError("");
    setSuccess("");

    try {
      await deleteCourse(courseId);
      setSuccess("Course deleted successfully.");
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteReview = async (courseId, reviewId) => {
    const confirmed = window.confirm("Delete this review? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    const key = `delete-review-${reviewId}`;
    setActionLoading(key);
    setError("");
    setSuccess("");

    try {
      await deleteFeedback(courseId, reviewId);
      setSuccess("Review deleted successfully.");
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Course Admin Panel</h1>
          <p className="text-gray-600 mt-1">
            Admins can create, update, and delete courses, manage course links, and moderate reviews.
          </p>
        </div>

        {!isAdmin ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            This page is restricted to admin users. Set your admin email in environment configuration.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <section className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCourseId ? "Edit Course" : "Create Course"}
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmitCourse}>
                <input
                  value={courseForm.title}
                  onChange={(e) => updateCourseForm({ title: e.target.value })}
                  placeholder="Course title"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
                <input
                  value={courseForm.provider}
                  onChange={(e) => updateCourseForm({ provider: e.target.value })}
                  placeholder="Provider"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
                <input
                  value={courseForm.category}
                  onChange={(e) => updateCourseForm({ category: e.target.value })}
                  placeholder="Industry"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
                <select
                  value={courseForm.level}
                  onChange={(e) => updateCourseForm({ level: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <input
                  value={courseForm.location}
                  onChange={(e) => updateCourseForm({ location: e.target.value })}
                  placeholder="Location"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  value={courseForm.skillsInput}
                  onChange={(e) => updateCourseForm({ skillsInput: e.target.value })}
                  placeholder="Skills (comma separated)"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
                <input
                  value={courseForm.courseUrl}
                  onChange={(e) => updateCourseForm({ courseUrl: e.target.value })}
                  placeholder="Real course link (https://...)"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm md:col-span-2"
                  required
                />
                <textarea
                  value={courseForm.description}
                  onChange={(e) => updateCourseForm({ description: e.target.value })}
                  placeholder="Course description"
                  rows={3}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm md:col-span-2"
                  required
                />
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={
                      actionLoading === "create-course" || actionLoading === `update-course-${editingCourseId}`
                    }
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
                  >
                    <ShieldCheck size={14} />
                    {editingCourseId ? "Update Course" : "Create Course"}
                  </button>
                  {editingCourseId && (
                    <button
                      type="button"
                      onClick={resetCourseForm}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>

            {loading ? (
              <div className="py-20 text-center text-gray-500">Loading courses...</div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {courses.map((course) => {
                  const feedbackList = feedbackByCourse[course._id] || [];

                  return (
                    <section key={course._id} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.provider} • {course.category} • {course.level} • {course.location}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">{course.description}</p>
                          <a
                            href={course.courseUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-teal-700 mt-2 hover:underline"
                          >
                            <ExternalLink size={14} />
                            {course.courseUrl}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            disabled={actionLoading === `delete-course-${course._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-300 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 border-t pt-4">
                        <h3 className="font-semibold text-gray-900">Course Reviews ({feedbackList.length})</h3>
                        <div className="mt-3 space-y-3">
                          {feedbackList.length === 0 ? (
                            <p className="text-sm text-gray-500">No reviews yet.</p>
                          ) : (
                            feedbackList.map((item) => (
                              <article key={item._id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <UserRound size={14} />
                                    <span>{item?.userId?.name || "Anonymous"}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{item?.userId?.email || ""}</span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteReview(course._id, item._id)}
                                    disabled={actionLoading === `delete-review-${item._id}`}
                                    className="px-3 py-1.5 rounded-md border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                                  >
                                    Delete Review
                                  </button>
                                </div>
                                <p className="text-sm text-gray-700 mt-2">Rating: {item.rating}/5</p>
                                {item.comment && <p className="text-sm text-gray-700 mt-1">{item.comment}</p>}
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
          </>
        )}
      </main>
    </div>
  );
};

export default CourseAdmin;
