import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import notificationApi from '../services/notificationApi';
import { 
  Home, BookOpen, Briefcase, Users, User, MessageSquare, 
  LogOut, Sparkles, Bell, Settings, ChevronLeft, ChevronRight,
  TrendingUp, Check, Trash2, X
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) => location.pathname === path || (path === '/home' && location.pathname === '/');

  const navItems = [
    { id: 'home', icon: Home, label: 'Feed', path: '/home' },
    { id: 'forums', icon: MessageSquare, label: 'Forums', path: '/forums' },
    { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { id: 'skill-profile', icon: Sparkles, label: 'Skills', path: '/skill-profile' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications(1, 10, false);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationText = (notification) => {
    const { type, from, message } = notification;
    if (from) {
      return `${from.name} ${type === 'connection_request' ? 'sent you a connection request' : message || 'sent you a message'}`;
    }
    return message || 'You have a new notification';
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-screen
      bg-white border-r border-[#E5E5EA]
      flex flex-col
      transition-all duration-300 ease-in-out
      z-40
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Logo */}
      <div className="p-4 border-b border-[#E5E5EA]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 
              className="text-xl font-bold text-[#1D1D1F] cursor-pointer hover:text-[#007AFF] transition-colors"
              onClick={() => navigate('/home')}
            >
              PathFinder
            </h1>
          )}
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-[#F5F5F7] text-[#86868B] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-[#E5F1FF] text-[#007AFF]' 
                    : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 1.5} />
                {!isCollapsed && (
                  <span className="font-medium text-[15px]">{item.label}</span>
                )}
                {isActive(item.path) && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Notifications Dropdown */}
        {!isCollapsed && (
          <div className="px-3 mt-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-all duration-200"
            >
              <Bell size={22} strokeWidth={1.5} />
              <span className="font-medium text-[15px]">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-[#FF3B30] text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="mt-2 bg-white border border-[#E5E5EA] rounded-xl shadow-lg max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-[14px] text-[#86868B]">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification._id}
                      className={`p-3 border-b border-[#E5E5EA] last:border-0 hover:bg-[#F5F5F7] ${!notification.isRead ? 'bg-[#E5F1FF]/50' : ''}`}
                    >
                      <p className="text-[14px] text-[#1D1D1F] line-clamp-2">{getNotificationText(notification)}</p>
                      <p className="text-[12px] text-[#A1A1A6] mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                    className="w-full p-2 text-center text-[13px] text-[#007AFF] hover:underline border-t border-[#E5E5EA]"
                  >
                    View all
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {!isCollapsed && (
          <>
            <div className="my-4 mx-3 h-px bg-[#E5E5EA]" />
            
            {/* Quick Stats */}
            <div className="px-4 py-2">
              <p className="text-[12px] font-medium text-[#86868B] uppercase tracking-wide mb-3">
                Your Stats
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#86868B]">Profile Views</span>
                  <span className="font-semibold text-[#007AFF]">{user?.profileViews || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#86868B]">Connections</span>
                  <span className="font-semibold text-[#007AFF]">{user?.connectionsCount || 0}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* User Profile Card */}
      <div className="p-3 border-t border-[#E5E5EA]">
        <div className={`
          flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F7] cursor-pointer transition-colors
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0" onClick={() => navigate('/profile')}>
              <p className="font-semibold text-[15px] text-[#1D1D1F] truncate">{user?.name || 'User'}</p>
              <p className="text-[13px] text-[#86868B] truncate">{user?.headline || 'Add headline'}</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => logout().then(() => navigate('/'))}
            className="w-full flex items-center justify-center gap-2 mt-2 py-2 text-[14px] text-[#86868B] hover:text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;