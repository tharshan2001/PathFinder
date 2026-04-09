import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import Navbar from '../components/Navbar';
import { BookOpen, Briefcase, TrendingUp, ArrowRight, Clock, Star, MapPin, Users, Building2, GraduationCap } from 'lucide-react';

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pathsRes, coursesRes] = await Promise.all([
        userApi.getEnrolledPaths().catch(() => ({ data: [] })),
        userApi.getSavedCourses().catch(() => ({ data: [] })),
      ]);
      setEnrolledPaths(pathsRes.data || []);
      setSavedCourses(coursesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleCourses = [
    { id: 1, title: 'React Fundamentals', category: 'Web Development', level: 'Beginner', duration: '8 hours', rating: 4.8 },
    { id: 2, title: 'Node.js Backend Mastery', category: 'Backend', level: 'Intermediate', duration: '12 hours', rating: 4.7 },
    { id: 3, title: 'Python for Data Science', category: 'Data Science', level: 'Beginner', duration: '15 hours', rating: 4.9 },
  ];

  const sampleJobs = [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', posted: '2 days ago' },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Colombo, Sri Lanka', type: 'Full-time', posted: '1 day ago' },
    { id: 3, title: 'Junior React Developer', company: 'WebAgency', location: 'Remote', type: 'Part-time', posted: '3 days ago' },
  ];

  const samplePaths = [
    { id: 1, title: 'Become a Full Stack Developer', courses: 8, duration: '40 hours', progress: 35 },
    { id: 2, title: 'Start Your Data Science Career', courses: 6, duration: '35 hours', progress: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#005eb5] to-[#00529f] rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
              <p className="mt-1 opacity-90">Continue your learning journey</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-white text-[#005eb5] rounded-lg font-medium text-sm hover:bg-[#faf9f6]">
                  Browse Courses
                </button>
                <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30">
                  Find Jobs
                </button>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2f3330] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#005eb5]" />
                  Recommended Courses
                </h2>
                <button onClick={() => navigate('/courses')} className="text-[#005eb5] text-sm font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {sampleCourses.map((course) => (
                  <div key={course.id} className="flex gap-4 p-3 border border-[#e0e4de] rounded-xl hover:border-[#005eb5] cursor-pointer transition-all">
                    <div className="w-16 h-16 bg-[#d6e3ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen size={24} className="text-[#005eb5]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2f3330]">{course.title}</h3>
                      <p className="text-sm text-[#5c605c]">{course.category} • {course.level}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#5c605c]">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                        <span className="flex items-center gap-1 text-amber-500 font-medium"><Star size={12} className="fill-amber-500" /> {course.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Opportunities */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2f3330] flex items-center gap-2">
                  <Briefcase size={20} className="text-[#005eb5]" />
                  Latest Jobs
                </h2>
                <button onClick={() => navigate('/jobs')} className="text-[#005eb5] text-sm font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {sampleJobs.map((job) => (
                  <div key={job.id} className="flex gap-4 p-3 border border-[#e0e4de] rounded-xl hover:border-[#005eb5] cursor-pointer transition-all">
                    <div className="w-12 h-12 bg-[#e6e9e4] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} className="text-[#5c605c]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2f3330]">{job.title}</h3>
                      <p className="text-sm text-[#5c605c] flex items-center gap-1">{job.company} • <MapPin size={12} /> {job.location}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#5c605c]">
                        <span className="bg-[#d6e3ff] text-[#005eb5] px-2 py-0.5 rounded-full font-medium">{job.type}</span>
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Network */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2f3330] flex items-center gap-2">
                  <Users size={20} className="text-[#005eb5]" />
                  People You May Know
                </h2>
                <button onClick={() => navigate('/network')} className="text-[#005eb5] text-sm font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border border-[#e0e4de] rounded-xl hover:border-[#005eb5] transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-[#005eb5] rounded-full flex items-center justify-center text-white font-bold mb-2">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <h4 className="font-medium text-[#2f3330] text-sm">Professional {i}</h4>
                    <p className="text-xs text-[#5c605c] mt-1">Software Engineer at Tech Co</p>
                    <button 
                      onClick={() => navigate('/network')}
                      className="mt-3 w-full py-1.5 border border-[#005eb5] text-[#005eb5] rounded-full text-sm font-medium hover:bg-[#005eb5] hover:text-white transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Learning Paths */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-4">
              <h3 className="font-semibold text-[#2f3330] mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#005eb5]" />
                Your Learning Paths
              </h3>
              <div className="space-y-3">
                {enrolledPaths.length > 0 ? (
                  enrolledPaths.slice(0, 2).map((path) => (
                    <div key={path._id} className="p-3 bg-[#f4f4f0] rounded-xl cursor-pointer hover:bg-[#e6e9e4] transition-all">
                      <h4 className="font-medium text-sm text-[#2f3330]">{path.title || 'Learning Path'}</h4>
                      <p className="text-xs text-[#5c605c] mt-1">{path.progress || 0}% complete</p>
                      <div className="h-1.5 bg-[#e0e4de] rounded-full mt-2">
                        <div className="h-1.5 bg-[#005eb5] rounded-full" style={{ width: `${path.progress || 0}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  samplePaths.map((path) => (
                    <div key={path.id} className="p-3 bg-[#f4f4f0] rounded-xl cursor-pointer hover:bg-[#e6e9e4] transition-all">
                      <h4 className="font-medium text-sm text-[#2f3330]">{path.title}</h4>
                      <p className="text-xs text-[#5c605c] mt-1">{path.courses} courses • {path.duration}</p>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => navigate('/learning')} className="w-full mt-3 py-2 text-sm text-[#005eb5] font-medium hover:underline">
                View all paths
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#005eb5] rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-[#2f3330]">{user?.name || 'User'}</h4>
                  <p className="text-xs text-[#5c605c]">{user?.headline || 'Add your headline'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5c605c]">Profile views</span>
                  <span className="font-medium text-[#005eb5]">{user?.profileViews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c605c]">Connections</span>
                  <span className="font-medium text-[#005eb5]">{user?.connectionsCount || 0}</span>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="w-full mt-4 py-2 border border-[#e0e4de] text-[#5c605c] rounded-lg text-sm font-medium hover:bg-[#f4f4f0] transition-colors">
                View Profile
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e4de] p-4">
              <h3 className="font-semibold text-[#2f3330] mb-3">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/forums')} className="w-full text-left px-3 py-2 text-sm text-[#5c605c] hover:bg-[#f4f4f0] rounded-lg transition-colors">
                  Discussion Forums
                </button>
                <button onClick={() => navigate('/messaging')} className="w-full text-left px-3 py-2 text-sm text-[#5c605c] hover:bg-[#f4f4f0] rounded-lg transition-colors">
                  Messages
                </button>
                <button onClick={() => navigate('/notifications')} className="w-full text-left px-3 py-2 text-sm text-[#5c605c] hover:bg-[#f4f4f0] rounded-lg transition-colors">
                  Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feed;