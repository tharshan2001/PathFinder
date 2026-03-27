import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Users,
  ArrowRight,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user, courses, jobs, learningPaths, trends } = useApp();

  const recommendedCourses = courses.slice(0, 4);
  const recommendedJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="mt-2 opacity-90">Here's what's happening with your career journey.</p>
          </div>
          <Sparkles size={48} className="opacity-30" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/courses" className="card card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center">
            <BookOpen size={24} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--slate-900)]">Continue Learning</p>
            <p className="text-sm text-[var(--slate-500)]">{user.enrolledCourses.length} courses</p>
          </div>
        </Link>
        <Link to="/jobs" className="card card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Briefcase size={24} className="text-[var(--blue)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--slate-900)]">Find Jobs</p>
            <p className="text-sm text-[var(--slate-500)]">{jobs.length} opportunities</p>
          </div>
        </Link>
        <Link to="/learning-path" className="card card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Target size={24} className="text-[var(--purple)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--slate-900)]">Learning Paths</p>
            <p className="text-sm text-[var(--slate-500)]">{learningPaths.length} paths</p>
          </div>
        </Link>
        <Link to="/connections" className="card card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Users size={24} className="text-[var(--amber)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--slate-900)]">Network</p>
            <p className="text-sm text-[var(--slate-500)]">{user.connections} connections</p>
          </div>
        </Link>
      </div>

      {/* Recommended Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Recommended Courses</h2>
          <Link to="/courses" className="text-sm font-medium text-[var(--primary)] flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {recommendedCourses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`} className="card card-hover p-0 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-28 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-sm text-[var(--slate-900)] line-clamp-2">{course.title}</h3>
                <p className="text-xs text-[var(--slate-500)] mt-1">{course.provider}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[var(--amber)] font-medium">★ {course.rating}</span>
                  <span className="text-xs text-[var(--slate-500)]">{course.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Recommended Jobs</h2>
          <Link to="/jobs" className="text-sm font-medium text-[var(--primary)] flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {recommendedJobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--slate-200)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30 transition-all">
              <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--slate-900)]">{job.title}</h3>
                <p className="text-sm text-[var(--slate-500)]">{job.company} · {job.location}</p>
              </div>
              <span className="text-sm font-medium text-[var(--primary)]">{job.salary}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Skills */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Trending Skills in Demand</h2>
          <Link to="/analytics" className="text-sm font-medium text-[var(--primary)] flex items-center gap-1">
            View Analytics <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {trends.map((trend) => (
            <div key={trend._id} className="p-4 rounded-xl bg-[var(--slate-50)] border border-[var(--slate-200)]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[var(--slate-900)] text-sm">{trend.skill}</span>
                <span className="text-xs font-semibold text-[var(--emerald)]">{trend.growth}</span>
              </div>
              <div className="w-full h-2 bg-[var(--slate-200)] rounded-full">
                <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] rounded-full" style={{ width: `${trend.demandScore}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
