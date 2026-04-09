import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import notificationApi from '../services/notificationApi';
import { Home, BookOpen, Briefcase, Users, User, MessageSquare, LogOut, Bell, Check, Trash2 } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection_request': return 'user-plus';
      case 'message': return 'message';
      case 'job_alert': return 'briefcase';
      case 'course_recommendation': return 'book-open';
      default: return 'bell';
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
            className="text-xl font-bold text-[#005eb5] cursor-pointer"
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
                    ? 'bg-blue-50 text-[#005eb5]' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            ))}
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col items-center px-3 py-2 rounded-lg transition text-gray-500 hover:bg-gray-100 hover:text-gray-900 relative"
              >
                <Bell size={20} />
                <span className="text-[10px] mt-0.5">Alerts</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-3 border-b flex justify-between items-center">
                    <span className="font-semibold text-[#2f3330]">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-[#005eb5] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500 text-sm">No notifications yet</p>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification._id}
                          className={`p-3 border-b last:border-0 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e6e9e4] flex items-center justify-center shrink-0">
                              <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#2f3330] line-clamp-2">
                                {getNotificationText(notification)}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="text-gray-400 hover:text-[#005eb5]"
                                  title="Mark as read"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-2 border-t bg-gray-50">
                    <button 
                      onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                      className="w-full text-center text-sm text-[#005eb5] hover:underline py-1"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
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
