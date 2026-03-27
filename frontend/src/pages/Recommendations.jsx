import { Sparkles, BookOpen, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Recommendations() {
  const { courses, jobs } = useApp();

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-[var(--purple)] to-[var(--primary)] text-white">
        <div className="flex items-center gap-4">
          <Sparkles size={40} />
          <div>
            <h1 className="text-2xl font-bold">AI-Powered Recommendations</h1>
            <p className="opacity-90 mt-1">Personalized suggestions based on your skills and goals</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Recommended Courses
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {courses.slice(0, 3).map(course => (
            <Link key={course._id} to={`/courses/${course._id}`} className="card card-hover p-4">
              <img src={course.thumbnail} alt={course.title} className="w-full h-28 rounded-lg object-cover mb-3" />
              <h3 className="font-medium text-[var(--slate-900)] line-clamp-2">{course.title}</h3>
              <p className="text-sm text-[var(--slate-500)] mt-1">{course.provider}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4 flex items-center gap-2">
          <Briefcase size={20} />
          Recommended Jobs
        </h2>
        <div className="space-y-3">
          {jobs.slice(0, 3).map(job => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--slate-200)] hover:border-[var(--primary)] transition-colors">
              <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--slate-900)]">{job.title}</h3>
                <p className="text-sm text-[var(--slate-500)]">{job.company} · {job.location}</p>
              </div>
              <ArrowRight size={18} className="text-[var(--primary)]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
