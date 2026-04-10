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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pathsRes] = await Promise.all([
        userApi.getEnrolledPaths().catch(() => ({ data: [] })),
      ]);
      setEnrolledPaths(pathsRes.data || []);
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
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-[20px] p-6 text-white">
              <h1 className="text-[28px] font-bold">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-[17px] opacity-90 mt-1">Continue your learning journey</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => navigate('/courses')} className="px-5 py-2.5 bg-white text-[#007AFF] rounded-[10px] font-semibold text-[15px] hover:bg-[#F5F5F7]">
                  Browse Courses
                </button>
                <button onClick={() => navigate('/jobs')} className="px-5 py-2.5 bg-white/20 text-white rounded-[10px] font-semibold text-[15px] hover:bg-white/30">
                  Find Jobs
                </button>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <BookOpen size={22} className="text-[#007AFF]" />
                  Recommended Courses
                </h2>
                <button onClick={() => navigate('/courses')} className="text-[#007AFF] text-[15px] font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {sampleCourses.map((course) => (
                  <div key={course.id} className="flex gap-4 p-3 rounded-[12px] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                    <div className="w-16 h-16 bg-[#E5F1FF] rounded-[12px] flex items-center justify-center">
                      <BookOpen size={24} className="text-[#007AFF]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[17px] text-[#1D1D1F]">{course.title}</h3>
                      <p className="text-[14px] text-[#86868B]">{course.category} • {course.level}</p>
                      <div className="flex items-center gap-3 mt-1 text-[13px] text-[#86868B]">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                        <span className="flex items-center gap-1 text-[#FF9500] font-medium"><Star size={12} className="fill-[#FF9500]" /> {course.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Opportunities */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <Briefcase size={22} className="text-[#007AFF]" />
                  Latest Jobs
                </h2>
                <button onClick={() => navigate('/jobs')} className="text-[#007AFF] text-[15px] font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {sampleJobs.map((job) => (
                  <div key={job.id} className="flex gap-4 p-3 rounded-[12px] hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-[#F5F5F7] rounded-[12px] flex items-center justify-center">
                      <Building2 size={20} className="text-[#86868B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[17px] text-[#1D1D1F]">{job.title}</h3>
                      <p className="text-[14px] text-[#86868B] flex items-center gap-1">{job.company} • <MapPin size={12} /> {job.location}</p>
                      <div className="flex items-center gap-3 mt-1 text-[13px] text-[#86868B]">
                        <span className="bg-[#E5F1FF] text-[#007AFF] px-2 py-0.5 rounded-full font-medium text-[12px]">{job.type}</span>
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* People You May Know */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <Users size={22} className="text-[#007AFF]" />
                  People You May Know
                </h2>
                <button onClick={() => navigate('/network')} className="text-[#007AFF] text-[15px] font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-[#F5F5F7] rounded-[12px] hover:bg-[#E5F1FF] transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white font-bold mb-2">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <h4 className="font-semibold text-[15px] text-[#1D1D1F]">Professional {i}</h4>
                    <p className="text-[12px] text-[#86868B] mt-1">Software Engineer</p>
                    <button 
                      onClick={() => navigate('/network')}
                      className="mt-3 w-full py-2 border border-[#007AFF] text-[#007AFF] rounded-[8px] text-[14px] font-semibold hover:bg-[#007AFF] hover:text-white transition-colors"
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
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-4">
              <h3 className="font-semibold text-[17px] text-[#1D1D1F] mb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#007AFF]" />
                Your Learning Paths
              </h3>
              <div className="space-y-3">
                {enrolledPaths.length > 0 ? (
                  enrolledPaths.slice(0, 2).map((path) => (
                    <div key={path._id} className="p-3 bg-[#F5F5F7] rounded-[10px] cursor-pointer hover:bg-[#E5E5EA] transition-colors">
                      <h4 className="font-medium text-[15px] text-[#1D1D1F]">{path.title || 'Learning Path'}</h4>
                      <p className="text-[13px] text-[#86868B] mt-1">{path.progress || 0}% complete</p>
                      <div className="h-1.5 bg-[#E5E5EA] rounded-full mt-2">
                        <div className="h-1.5 bg-[#007AFF] rounded-full" style={{ width: `${path.progress || 0}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  samplePaths.map((path) => (
                    <div key={path.id} className="p-3 bg-[#F5F5F7] rounded-[10px] cursor-pointer hover:bg-[#E5E5EA] transition-colors">
                      <h4 className="font-medium text-[15px] text-[#1D1D1F]">{path.title}</h4>
                      <p className="text-[13px] text-[#86868B] mt-1">{path.courses} courses • {path.duration}</p>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => navigate('/learning')} className="w-full mt-3 py-2 text-[15px] text-[#007AFF] font-medium hover:underline">
                View all paths
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-[#007AFF] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-[17px] text-[#1D1D1F]">{user?.name || 'User'}</h4>
                  <p className="text-[13px] text-[#86868B]">{user?.headline || 'Add your headline'}</p>
                </div>
              </div>
              <div className="space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <span className="text-[#86868B]">Profile views</span>
                  <span className="font-medium text-[#007AFF]">{user?.profileViews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868B]">Connections</span>
                  <span className="font-medium text-[#007AFF]">{user?.connectionsCount || 0}</span>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="w-full mt-4 py-2.5 border border-[#E5E5EA] text-[#86868B] rounded-[10px] text-[15px] font-medium hover:bg-[#F5F5F7] transition-colors">
                View Profile
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E5E5EA] p-4">
              <h3 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">Quick Links</h3>
              <div className="space-y-1">
                <button onClick={() => navigate('/forums')} className="w-full text-left px-3 py-2.5 text-[15px] text-[#86868B] hover:bg-[#F5F5F7] rounded-[8px] transition-colors">
                  Discussion Forums
                </button>
                <button onClick={() => navigate('/messaging')} className="w-full text-left px-3 py-2.5 text-[15px] text-[#86868B] hover:bg-[#F5F5F7] rounded-[8px] transition-colors">
                  Messages
                </button>
                <button onClick={() => navigate('/notifications')} className="w-full text-left px-3 py-2.5 text-[15px] text-[#86868B] hover:bg-[#F5F5F7] rounded-[8px] transition-colors">
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