import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Briefcase } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import JobCard from '../components/jobs/JobCard';

export default function Dashboard() {
  const { user, courses, jobs, trends, getEnrolledCourses } = useApp();
  const enrolledCourses = getEnrolledCourses();

  return (
    <div className="animate-in flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Overview of your learning progress and recommendations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Courses Enrolled', value: enrolledCourses.length, color: 'text-primary' },
          { label: 'Hours Learned', value: '47', color: 'text-emerald-600' },
          { label: 'Skills Gained', value: '12', color: 'text-amber-500' },
          { label: 'Certificates', value: '3', color: 'text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Continue Learning</h2>
            <Link to="/courses" className="text-sm text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {enrolledCourses.slice(0, 2).map((course) => (
              <Link 
                key={course._id} 
                to={`/courses/${course._id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-14 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">{course.title}</h3>
                  <p className="text-sm text-slate-500">{course.provider}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-primary">{user.progress[course._id] || 0}%</p>
                  <div className="w-24 h-2 bg-slate-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${user.progress[course._id] || 0}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recommended Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recommended Courses</h2>
            <Link to="/courses" className="text-sm text-primary flex items-center gap-1 hover:underline">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>

        {/* Trending Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-900">Trending Skills</h2>
          </div>
          <div className="card flex flex-col gap-4">
            {trends.slice(0, 5).map((trend, i) => (
              <div key={trend._id} className="flex items-center gap-3">
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-primary text-white' : 
                    i === 1 ? 'bg-primary/80 text-white' : 
                    i === 2 ? 'bg-primary/60 text-white' : 'bg-slate-100 text-slate-500'}
                `}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{trend.skill}</p>
                  <p className="text-xs text-primary">{trend.growth} <span className="text-slate-400">growth</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-900">Jobs For You</h2>
          </div>
          <Link to="/jobs" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all jobs <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {jobs.slice(0, 4).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

