import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, GraduationCap } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { getMyEnrollments, updateEnrollmentProgress } from "../services/courseApi";

const MyEnrollments = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const userId = user?._id;

  const loadEnrollments = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getMyEnrollments();
      setEnrollments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [userId]);

  const enrolledCount = useMemo(() => enrollments.length, [enrollments]);
  const completedCount = useMemo(
    () => enrollments.filter((item) => Number(item.progress || 0) >= 100).length,
    [enrollments]
  );

  const handleStartCourse = (courseUrl) => {
    if (!courseUrl) {
      setError("This course does not have a course link yet.");
      return;
    }

    window.open(courseUrl, "_blank", "noopener,noreferrer");
  };

  const handleProgressUpdate = async (enrollmentId, progress) => {
    const key = `progress-${enrollmentId}-${progress}`;
    setActionLoading(key);
    setError("");

    try {
      const updated = await updateEnrollmentProgress(enrollmentId, progress);
      setEnrollments((prev) =>
        prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update progress");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1D1D1F]">My Enrollments</h1>
        <p className="text-[#6E6E73] mt-1">Track your enrolled courses, progress, and continue learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border border-[#E5E5EA] bg-white p-4">
          <p className="text-sm text-[#6E6E73]">Enrolled Courses</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">{enrolledCount}</p>
        </div>
        <div className="rounded-xl border border-[#E5E5EA] bg-white p-4">
          <p className="text-sm text-[#6E6E73]">Completed Courses</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">{completedCount}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-[#6E6E73]">Loading enrolled courses...</div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-xl border border-[#E5E5EA] bg-white p-10 text-center">
          <GraduationCap size={38} className="mx-auto text-[#A1A1A6]" />
          <h2 className="mt-3 text-lg font-semibold text-[#1D1D1F]">No enrolled courses yet</h2>
          <p className="mt-1 text-[#6E6E73]">Browse courses and enroll to start learning.</p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 px-4 py-2 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0066D6]"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((item) => {
            const course = item.courseId;
            const progress = Number(item.progress || 0);

            return (
              <section key={item._id} className="rounded-xl border border-[#E5E5EA] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1D1D1F]">{course?.title || "Untitled course"}</h2>
                    <p className="text-sm text-[#6E6E73] mt-1">
                      {course?.provider || "Unknown provider"} • {course?.level || "Level n/a"}
                    </p>
                    <p className="text-sm text-[#1D1D1F] mt-2">Status: {item.status || "enrolled"}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/courses?courseId=${course?._id || ""}`)}
                      className="px-3 py-1.5 rounded-md border border-[#D1D1D6] text-sm text-[#1D1D1F] hover:bg-[#F5F5F7]"
                    >
                      View Course
                    </button>
                    <button
                      onClick={() => handleStartCourse(course?.courseUrl)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#9BD0FF] text-sm text-[#0066D6] hover:bg-[#EEF7FF]"
                    >
                      <ExternalLink size={14} />
                      Start Course
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#EFEFF4] pt-4">
                  <p className="text-sm text-[#1D1D1F]">Progress: {progress}%</p>
                  <div className="mt-1 h-2.5 w-full bg-[#F2F2F7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#34C759]" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[25, 50, 75, 100].map((step) => (
                      <button
                        key={step}
                        onClick={() => handleProgressUpdate(item._id, step)}
                        disabled={actionLoading === `progress-${item._id}-${step}`}
                        className="px-3 py-1.5 rounded-md border border-[#D1D1D6] text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-60"
                      >
                        {step}%
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
