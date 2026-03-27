import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, Clock, Users, BookOpen, Play, Check, ArrowLeft } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { getCourseById, enrolledCourses, enrollInCourse, savedCourses, toggleSaveCourse } = useApp();
  const course = getCourseById(id);
  const isEnrolled = enrolledCourses.includes(id);
  const isSaved = savedCourses.includes(id);

  if (!course) {
    return <div className="card">Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/courses" className="text-[var(--primary)] hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <div className="card">
        <div className="flex gap-6">
          <img src={course.thumbnail} alt={course.title} className="w-80 h-48 rounded-xl object-cover" />
          <div className="flex-1">
            <span className="tag tag-primary">{course.category}</span>
            <h1 className="text-2xl font-bold text-[var(--slate-900)] mt-2">{course.title}</h1>
            <p className="text-[var(--slate-600)] mt-2">{course.description}</p>
            
            <div className="flex items-center gap-6 mt-4">
              <span className="flex items-center gap-1 text-[var(--amber)]">
                <Star size={18} fill="currentColor" /> {course.rating} ({course.totalRatings})
              </span>
              <span className="flex items-center gap-1 text-[var(--slate-500)]">
                <Users size={18} /> {course.enrolledUsers.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1 text-[var(--slate-500)]">
                <Clock size={18} /> {course.duration}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <img src={course.instructorAvatar} alt={course.instructor} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium text-[var(--slate-900)]">{course.instructor}</p>
                <p className="text-sm text-[var(--slate-500)]">{course.provider}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              {isEnrolled ? (
                <button className="btn btn-primary">
                  <Play size={18} /> Continue Learning
                </button>
              ) : (
                <button onClick={() => enrollInCourse(course._id)} className="btn btn-primary">
                  Enroll Now - ${course.price}
                </button>
              )}
              <button 
                onClick={() => toggleSaveCourse(course._id)}
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
              >
                {isSaved ? 'Saved' : 'Save for Later'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Skills You'll Learn</h2>
        <div className="flex flex-wrap gap-2">
          {course.skills.map(skill => (
            <span key={skill} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
              <Check size={14} /> {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-4">Course Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[var(--slate-500)]">Level</p>
            <p className="font-medium text-[var(--slate-900)]">{course.level}</p>
          </div>
          <div>
            <p className="text-[var(--slate-500)]">Duration</p>
            <p className="font-medium text-[var(--slate-900)]">{course.duration}</p>
          </div>
          <div>
            <p className="text-[var(--slate-500)]">Modules</p>
            <p className="font-medium text-[var(--slate-900)]">{course.modules} modules</p>
          </div>
          <div>
            <p className="text-[var(--slate-500)]">Location</p>
            <p className="font-medium text-[var(--slate-900)]">{course.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
