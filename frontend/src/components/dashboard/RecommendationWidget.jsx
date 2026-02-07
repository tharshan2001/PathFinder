import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Lightbulb, ArrowRight, Star, MapPin } from 'lucide-react';

export default function RecommendationWidget() {
  const { courses, jobs } = useApp();

  const recommendedCourses = courses.slice(0, 2);
  const recommendedJobs = jobs.slice(0, 2);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-amber-400" size={20} />
          <h2 className="text-lg font-semibold">Recommended for You</h2>
        </div>
        <Link 
          to="/recommendations" 
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {/* Courses */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">COURSES</h3>
        <div className="space-y-3">
          {recommendedCourses.map((course) => (
            <Link 
              key={course._id}
              to={`/courses/${course._id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">JOBS</h3>
        <div className="space-y-3">
          {recommendedJobs.map((job) => (
            <Link 
              key={job._id}
              to={`/jobs/${job._id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-8 h-8 rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{job.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{job.company}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{job.location.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
