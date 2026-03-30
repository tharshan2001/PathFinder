import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import { BookOpen, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const courses = [
    { id: 1, title: 'React Fundamentals', category: 'Web Development', level: 'Beginner', duration: '8 hours', rating: 4.8 },
    { id: 2, title: 'Node.js Backend Mastery', category: 'Backend', level: 'Intermediate', duration: '12 hours', rating: 4.7 },
    { id: 3, title: 'Python for Data Science', category: 'Data Science', level: 'Beginner', duration: '15 hours', rating: 4.9 },
  ];

  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', posted: '2 days ago' },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Colombo, Sri Lanka', type: 'Full-time', posted: '1 day ago' },
    { id: 3, title: 'Junior React Developer', company: 'WebAgency', location: 'Remote', type: 'Part-time', posted: '3 days ago' },
  ];

  const learningPaths = [
    { id: 1, title: 'Become a Full Stack Developer', courses: 8, duration: '40 hours' },
    { id: 2, title: 'Start Your Data Science Career', courses: 6, duration: '35 hours' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left - Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="mt-1 opacity-90">Continue your learning journey</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-white text-teal-600 rounded-lg font-medium text-sm">
                  Browse Courses
                </button>
                <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm">
                  Find Jobs
                </button>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-teal-600" />
                  Recommended Courses
                </h2>
                <button onClick={() => navigate('/courses')} className="text-teal-600 text-sm font-medium flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="flex gap-4 p-3 border rounded-lg hover:border-teal-300 cursor-pointer transition">
                    <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={24} className="text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.category} • {course.level}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{course.duration}</span>
                        <span className="text-teal-600 font-medium">★ {course.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Opportunities */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} className="text-teal-600" />
                  Latest Jobs
                </h2>
                <button onClick={() => navigate('/jobs')} className="text-teal-600 text-sm font-medium flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="flex gap-4 p-3 border rounded-lg hover:border-teal-300 cursor-pointer transition">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded">{job.type}</span>
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div className="space-y-4">
            {/* Learning Paths */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-600" />
                Learning Paths
              </h3>
              <div className="space-y-3">
                {learningPaths.map((path) => (
                  <div key={path.id} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <h4 className="font-medium text-sm text-gray-900">{path.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{path.courses} courses • {path.duration}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/learning')} className="w-full mt-3 py-2 text-sm text-teal-600 font-medium hover:underline">
                View all paths
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Courses completed</span>
                    <span className="font-medium">2/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-teal-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Jobs applied</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feed;
