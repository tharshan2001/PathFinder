import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, Briefcase, Trash2 } from 'lucide-react';

export default function SavedItems() {
  const { getSavedCourses, getSavedJobs, savedCourses, savedJobs, toggleSaveCourse, toggleSaveJob } = useApp();
  const savedCourseItems = getSavedCourses();
  const savedJobItems = getSavedJobs();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Saved Items</h1>
        <p className="text-[var(--slate-500)] mt-2">Your bookmarked courses and jobs</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Saved Courses ({savedCourseItems.length})
        </h2>
        {savedCourseItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {savedCourseItems.map(course => (
              <div key={course._id} className="card card-hover p-0 overflow-hidden relative">
                <button
                  onClick={() => toggleSaveCourse(course._id)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white text-[var(--primary)] z-10"
                >
                  <Trash2 size={16} />
                </button>
                <Link to={`/courses/${course._id}`}>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <h3 className="font-medium text-[var(--slate-900)] line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-[var(--slate-500)] mt-1">{course.provider}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--slate-500)] text-center py-8">No saved courses yet.</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4 flex items-center gap-2">
          <Briefcase size={20} />
          Saved Jobs ({savedJobItems.length})
        </h2>
        {savedJobItems.length > 0 ? (
          <div className="space-y-3">
            {savedJobItems.map(job => (
              <div key={job._id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--slate-200)]">
                <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Link to={`/jobs/${job._id}`} className="font-semibold text-[var(--slate-900)] hover:text-[var(--primary)]">
                    {job.title}
                  </Link>
                  <p className="text-sm text-[var(--slate-500)]">{job.company} · {job.location}</p>
                </div>
                <button
                  onClick={() => toggleSaveJob(job._id)}
                  className="p-2 rounded-lg text-[var(--slate-400)] hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--slate-500)] text-center py-8">No saved jobs yet.</p>
        )}
      </div>
    </div>
  );
}
