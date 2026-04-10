import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, BookOpen, Sparkles, Star } from 'lucide-react';

import { getRecommendedCourses } from '../services/skillProfileApi';

const RecommendedCourses = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecommendedCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getRecommendedCourses();
      setGroups(response?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommended courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendedCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <section className="bg-gradient-to-r from-[#007AFF] to-[#0056B3] rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="inline-flex items-center gap-2 text-xs bg-white/20 border border-white/30 px-2.5 py-1 rounded-full mb-3">
                <Sparkles size={14} />
                Upskill Roadmap
              </p>
              <h1 className="text-2xl font-bold">Recommended Courses</h1>
              <p className="text-sm text-white/90 mt-1">
                Curated courses selected to close your strongest skill gaps.
              </p>
            </div>
            <button
              onClick={() => navigate('/skill-gap-analysis')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0056B3] text-sm font-semibold hover:bg-[#E5F1FF] transition"
            >
              <ArrowLeft size={16} />
              Back to Analysis
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 inline-flex items-start gap-2 w-full">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">Loading course recommendations...</div>
        ) : groups.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            No course recommendations yet. You may already match most high-demand skills.
          </div>
        ) : (
          <section className="space-y-4">
            {groups.map((group) => (
              <div key={group.skill} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{group.skill}</h2>
                <p className="text-sm text-gray-600 mt-1">Suggested learning paths for this missing skill.</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {(group.courses || []).map((course) => (
                    <article
                      key={course._id}
                      className="rounded-xl border border-gray-200 p-4 bg-gray-50 hover:border-[#E5F1FF] transition"
                    >
                      <div className="inline-flex items-center gap-1 text-xs text-[#0056B3] bg-[#E5F1FF] border border-[#E5F1FF] px-2 py-1 rounded-full">
                        <BookOpen size={13} />
                        {course.category}
                      </div>
                      <h3 className="font-semibold text-gray-900 mt-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.provider}</p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">{course.description}</p>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">{course.level}</span>
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          <Star size={14} className="fill-amber-500" />
                          {Number(course.ratingAvg || 0).toFixed(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/courses?courseId=${encodeURIComponent(course._id)}`)}
                        className="mt-3 w-full px-3 py-2 rounded-lg bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0056B3] transition"
                      >
                        Open Course
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default RecommendedCourses;

