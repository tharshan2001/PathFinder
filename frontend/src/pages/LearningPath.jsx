import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Route, Target, BookOpen, Briefcase, ArrowRight, Check, Lock } from 'lucide-react';

export default function LearningPath() {
  const { learningPaths, courses, user } = useApp();

  const activePath = learningPaths[0]; // Full Stack Web Developer path
  const pathCourses = activePath.courses.map(id => courses.find(c => c._id === id)).filter(Boolean);

  const milestones = [
    { id: 1, title: 'Frontend Fundamentals', completed: true, courses: ['HTML/CSS', 'JavaScript'] },
    { id: 2, title: 'React Development', completed: true, courses: ['React Basics', 'Redux'] },
    { id: 3, title: 'Backend Development', completed: false, current: true, courses: ['Node.js', 'Express'] },
    { id: 4, title: 'Database & API', completed: false, courses: ['MongoDB', 'REST APIs'] },
    { id: 5, title: 'Deployment & DevOps', completed: false, courses: ['Docker', 'CI/CD'] }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-indigo-500/10 to-teal-500/10 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500">
            <Route className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{activePath.title}</h1>
            <p className="text-gray-400 mb-4">{activePath.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2">
                <Target size={16} className="text-indigo-400" />
                {activePath.duration} program
              </span>
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-teal-400" />
                {activePath.courses.length} courses
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={16} className="text-amber-400" />
                Career-focused
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Your Progress</p>
            <p className="text-3xl font-bold gradient-text">{activePath.progress}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Learning path */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Your Learning Journey</h2>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Connector line */}
                {index < milestones.length - 1 && (
                  <div className={`absolute left-6 top-14 w-0.5 h-full -mb-6 ${
                    milestone.completed ? 'bg-gradient-to-b from-emerald-500 to-indigo-500' : 'bg-white/10'
                  }`} />
                )}
                
                <div className={`card ${milestone.current ? 'border-indigo-500/50' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      milestone.completed 
                        ? 'bg-emerald-500' 
                        : milestone.current 
                          ? 'bg-indigo-500' 
                          : 'bg-white/10'
                    }`}>
                      {milestone.completed ? (
                        <Check size={24} className="text-white" />
                      ) : milestone.current ? (
                        <span className="text-white font-bold">{milestone.id}</span>
                      ) : (
                        <Lock size={18} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{milestone.title}</h3>
                        {milestone.completed && (
                          <span className="badge badge-success">Completed</span>
                        )}
                        {milestone.current && (
                          <span className="badge badge-primary">In Progress</span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {milestone.courses.map((course) => (
                          <span key={course} className="badge bg-white/5 text-gray-300">
                            {course}
                          </span>
                        ))}
                      </div>

                      {milestone.current && (
                        <button className="btn btn-primary">
                          Continue Learning
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Overall progress */}
          <div className="card">
            <h3 className="font-semibold mb-4">Overall Progress</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="12"
                  strokeDasharray={`${activePath.progress * 3.52} 352`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{activePath.progress}%</span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400">
              <p>2 of 5 milestones completed</p>
            </div>
          </div>

          {/* Skills you'll gain */}
          <div className="card">
            <h3 className="font-semibold mb-4">Skills You'll Gain</h3>
            <div className="flex flex-wrap gap-2">
              {activePath.skills.map((skill) => (
                <span key={skill} className="badge badge-secondary">{skill}</span>
              ))}
            </div>
          </div>

          {/* Recommended courses */}
          <div className="card">
            <h3 className="font-semibold mb-4">Continue With</h3>
            <div className="space-y-3">
              {pathCourses.slice(0, 2).map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-gray-400">{course.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
