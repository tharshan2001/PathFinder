import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Star, Clock, Users, BookOpen, Play, 
  Bookmark, BookmarkCheck, Share2, Award, Check
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { getCourseById, savedCourses, toggleSaveCourse, enrolledCourses, enrollInCourse, feedback, user } = useApp();
  
  const course = getCourseById(id);
  const isSaved = savedCourses.includes(id);
  const isEnrolled = enrolledCourses.includes(id);
  const courseFeedback = feedback.filter(f => f.courseId === id);
  const progress = user.progress[id] || 0;

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
      </div>
    );
  }

  const modules = [
    { id: 1, title: 'Introduction & Setup', duration: '45 min', completed: true },
    { id: 2, title: 'Core Fundamentals', duration: '2 hrs', completed: true },
    { id: 3, title: 'Advanced Concepts', duration: '3 hrs', completed: true },
    { id: 4, title: 'Building Projects', duration: '4 hrs', completed: false },
    { id: 5, title: 'Best Practices', duration: '2 hrs', completed: false },
    { id: 6, title: 'Final Project', duration: '5 hrs', completed: false },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Back button */}
      <Link to="/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={20} />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero section */}
          <div className="glass-card overflow-hidden p-0">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </button>
            </div>
            <div className="p-6">
              <span className="badge badge-primary mb-3">{course.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">{course.rating}</span>
                  <span>({course.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>{course.enrolledUsers.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={18} />
                  <span>{course.modules} modules</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <p className="text-sm text-gray-400">Instructor</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-300 leading-relaxed">{course.description}</p>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Skills You'll Learn</h2>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <span key={skill} className="badge badge-secondary">{skill}</span>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    module.completed ? 'bg-emerald-500/10' : 'bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    module.completed 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {module.completed ? <Check size={16} /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{module.title}</h3>
                  </div>
                  <span className="text-sm text-gray-400">{module.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
            <div className="space-y-4">
              {courseFeedback.map((review) => (
                <div key={review._id} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-start gap-3">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.userName}</span>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold gradient-text">${course.price}</span>
            </div>

            {/* Progress (if enrolled) */}
            {isEnrolled && (
              <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-indigo-400 font-bold">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="space-y-3">
              {isEnrolled ? (
                <button className="btn btn-primary w-full">
                  <Play size={18} />
                  Continue Learning
                </button>
              ) : (
                <button 
                  onClick={() => enrollInCourse(id)}
                  className="btn btn-primary w-full"
                >
                  Enroll Now
                </button>
              )}
              
              <button
                onClick={() => toggleSaveCourse(id)}
                className="btn btn-secondary w-full"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={18} />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    Save for Later
                  </>
                )}
              </button>

              <button className="btn btn-outline w-full">
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Course includes */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4">This course includes:</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-indigo-400" />
                  {course.duration} of content
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen size={16} className="text-indigo-400" />
                  {course.modules} modules
                </li>
                <li className="flex items-center gap-3">
                  <Award size={16} className="text-indigo-400" />
                  Certificate of completion
                </li>
                <li className="flex items-center gap-3">
                  <Users size={16} className="text-indigo-400" />
                  Lifetime access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
