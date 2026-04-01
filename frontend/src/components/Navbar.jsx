import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Home, BookOpen, Briefcase, Users, User, MessageSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path === '/forums') return 'forums';
    if (path === '/courses') return 'courses';
    if (path === '/jobs') return 'jobs';
    if (path === '/network') return 'network';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const activeNav = getActiveNav();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'forums', icon: MessageSquare, label: 'Forums', path: '/forums' },
    { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div 
            className="text-xl font-bold text-teal-600 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            PathFinder
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition ${
                  activeNav === item.id 
                    ? 'bg-teal-50 text-teal-600' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-3 py-2 rounded-lg transition text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut size={20} />
              <span className="text-[10px] mt-0.5">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
