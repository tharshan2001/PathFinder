import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import notificationApi from '../services/notificationApi';
import { Home, BookOpen, Briefcase, Users, User, MessageSquare, LogOut, Sparkles, Bell, Check, Trash2, X, Shield } from 'lucide-react';
import { isAdminUser } from '../utils/adminAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications(1, 10, false);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationText = (notification) => {
    const { type, from, message } = notification;
    if (from) {
      return `${from.name} ${type === 'connection_request' ? 'sent you a connection request' : message || 'sent you a message'}`;
    }
    return message || 'You have a new notification';
  };

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path === '/forums') return 'forums';
    if (path === '/courses') return 'courses';
    if (path === '/courses/admin') return 'course-admin';
    if (path === '/jobs') return 'jobs';
    if (path === '/network') return 'network';
    if (path === '/profile') return 'profile';
    if (path === '/skill-profile' || path === '/recommended-jobs' || path === '/skill-gap-analysis' || path === '/recommended-courses') {
      return 'skill-profile';
    }
    return 'home';
  };

  const activeNav = getActiveNav();
  const admin = isAdminUser(user);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'forums', icon: MessageSquare, label: 'Forums', path: '/forums' },
    { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
    ...(admin ? [{ id: 'course-admin', icon: Shield, label: 'Course Admin', path: '/courses/admin' }] : []),
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { id: 'skill-profile', icon: Sparkles, label: 'My Skill Profile', path: '/skill-profile' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div 
            className="text-xl font-bold text-[#1D1D1F] cursor-pointer tracking-tight"
            onClick={() => navigate('/home')}
          >
            PathFinder
          </div>

          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-4 py-2 rounded-[10px] transition-all duration-200 ${
                  activeNav === item.id 
                    ? 'bg-[#E5F1FF] text-[#007AFF]' 
                    : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                }`}
              >
                <item.icon size={22} strokeWidth={activeNav === item.id ? 2.5 : 1.5} />
                <span className="text-[11px] mt-0.5 font-medium">{item.label}</span>
              </button>
            ))}
            
            {/* Notifications */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col items-center px-4 py-2 rounded-[10px] transition-all duration-200 text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] relative"
              >
                <Bell size={22} strokeWidth={1.5} />
                <span className="text-[11px] mt-0.5 font-medium">Alerts</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] bg-[#FF3B30] text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#E5E5EA] overflow-hidden z-50 animate-scale-in">
                  <div className="p-4 border-b border-[#E5E5EA] flex justify-between items-center">
                    <span className="font-semibold text-[#1D1D1F] text-[17px]">Notifications</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[#86868B] hover:text-[#1D1D1F]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {unreadCount > 0 && (
                    <div className="px-4 py-2 bg-[#F5F5F7]">
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-[#007AFF] font-medium hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell size={32} className="text-[#D1D1D6] mx-auto mb-2" />
                        <p className="text-[#86868B] text-[15px]">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification._id}
                          className={`p-4 border-b border-[#E5E5EA] last:border-0 hover:bg-[#F5F5F7] transition-colors ${!notification.isRead ? 'bg-[#E5F1FF]/50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                              <Bell size={18} className="text-[#86868B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] text-[#1D1D1F] leading-tight">
                                {getNotificationText(notification)}
                              </p>
                              <p className="text-[13px] text-[#A1A1A6] mt-1.5">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="text-[#86868B] hover:text-[#007AFF] p-1 rounded hover:bg-[#E5F1FF]"
                                  title="Mark as read"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="text-[#86868B] hover:text-[#FF3B30] p-1 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-[#E5E5EA] bg-[#F5F5F7]">
                    <button 
                      onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                      className="w-full text-center text-[15px] text-[#007AFF] font-medium hover:underline py-1"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-4 py-2 rounded-[10px] transition-all duration-200 text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] ml-1"
            >
              <LogOut size={22} strokeWidth={1.5} />
              <span className="text-[11px] mt-0.5 font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;