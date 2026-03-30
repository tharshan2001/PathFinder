import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Home, User, Bell, Briefcase, MessageSquare, Search, LogOut, Users } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/feed') return 'home';
    if (path === '/network') return 'network';
    if (path === '/messaging') return 'messaging';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const activeNav = getActiveNav();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/feed' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/feed' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', path: '/messaging' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/feed' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div 
              className="text-2xl font-bold text-teal-600 cursor-pointer"
              onClick={() => navigate('/feed')}
            >
              PathFinder
            </div>
            <div className="hidden md:flex items-center bg-gray-100 border rounded-xl px-3 py-2">
              <Search size={18} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none ml-2 w-48 text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition ${
                  activeNav === item.id 
                    ? 'bg-teal-50 text-teal-600' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={22} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-4 py-2 rounded-xl transition text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut size={22} />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
