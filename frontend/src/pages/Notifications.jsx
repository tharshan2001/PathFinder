import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../stores/toastStore';

import notificationApi from '../services/notificationApi';
import { Bell, Check, Trash2, CheckCircle, UserPlus, MessageSquare, Briefcase, BookOpen, ArrowLeft } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications(1, 50, filter === 'unread');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
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
      // Error toast handled by API interceptor
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      // Error toast handled by API interceptor
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      const deleted = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (err) {
      // Error toast handled by API interceptor
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection_request': return <UserPlus size={20} className="text-[var(--color-primary)]" />;
      case 'message': return <MessageSquare size={20} className="text-[var(--color-primary)]" />;
      case 'job_alert': return <Briefcase size={20} className="text-[var(--color-primary)]" />;
      case 'course_recommendation': return <BookOpen size={20} className="text-[var(--color-primary)]" />;
      default: return <Bell size={20} className="text-[var(--color-primary)]" />;
    }
  };

  const getNotificationText = (notification) => {
    const { type, from, message } = notification;
    if (from) {
      return `${from.name} ${type === 'connection_request' ? 'sent you a connection request' : message || 'sent you a message'}`;
    }
    return message || 'You have a new notification';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <main className="max-w-3xl mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] mb-4"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={24} className="text-[var(--color-primary)]" />
                <h1 className="text-2xl font-bold text-[#2f3330]">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e4e2e2] text-[#515252] rounded-lg hover:bg-[#d7dbd5] transition-colors"
                >
                  <CheckCircle size={16} />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-[#f4f4f0] text-[#5c605c] hover:bg-[#e6e9e4]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-[#f4f4f0] text-[#5c605c] hover:bg-[#e6e9e4]'
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-[#5c605c]">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#e6e9e4] flex items-center justify-center shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-[#2f3330] ${!notification.isRead ? 'font-medium' : ''}`}>
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[#e6e9e4] rounded-lg"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
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
        </div>
      </main>
    </div>
  );
};

export default Notifications;