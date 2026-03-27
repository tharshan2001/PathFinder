import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Users,
  Star,
  Clock
} from 'lucide-react';

export default function FeedPage() {
  const { courses, jobs, trends, user } = useApp();

  const featuredCourses = courses.slice(0, 3);
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="mt-2 opacity-90">Continue your learning journey and discover new opportunities.</p>
            <div className="flex gap-3 mt-4">
              <Link to="/courses" className="btn bg-white text-[var(--primary)] hover:bg-[var(--slate-100)]">
                <BookOpen size={18} />
                Continue Learning
              </Link>
              <Link to="/jobs" className="btn bg-white/20 text-white hover:bg-white/30">
                <Briefcase size={18} />
                Browse Jobs
              </Link>
            </div>
          </div>
          <Sparkles size={64} className="opacity-30 hidden md:block" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} className="text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">{user.completedCourses}</p>
          <p className="text-sm text-[var(--slate-500)]">Courses Completed</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <Clock size={24} className="text-[var(--blue)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">47</p>
          <p className="text-sm text-[var(--slate-500)]">Hours Learned</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <Briefcase size={24} className="text-[var(--amber)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">{user.appliedJobs}</p>
          <p className="text-sm text-[var(--slate-500)]">Jobs Applied</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <Users size={24} className="text-[var(--purple)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--slate-900)]">{user.connections}</p>
          <p className="text-sm text-[var(--slate-500)]">Connections</p>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Featured Courses</h2>
          <Link to="/courses" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {featuredCourses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`} className="card card-hover p-0 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-[var(--slate-900)] text-sm line-clamp-2">{course.title}</h3>
                <p className="text-xs text-[var(--slate-500)] mt-1">{course.provider}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[var(--amber)] fill-[var(--amber)]" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <span className="text-xs text-[var(--slate-500)]">{course.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Featured Jobs</h2>
          <Link to="/jobs" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {featuredJobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--slate-200)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30 transition-all">
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-12 h-12 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--slate-900)]">{job.title}</h3>
                <p className="text-sm text-[var(--slate-500)]">{job.company} · {job.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--primary)]">{job.salary}</p>
                <p className="text-xs text-[var(--slate-500)]">{job.applicants} applicants</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Skills */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--slate-900)]">Trending Skills</h2>
          <Link to="/analytics" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
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
              <div className="w-full h-2 bg-[var(--slate-200)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--emerald)] rounded-full"
                  style={{ width: `${trend.demandScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
