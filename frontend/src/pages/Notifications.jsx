import { useApp } from '../context/AppContext';
import { Bell, Check, X, BookOpen, Briefcase, Users, MessageCircle } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, dismissNotification, markAllNotificationsRead } = useApp();

  const getIcon = (type) => {
    const icons = {
      course: <BookOpen size={18} className="text-[#0284C7]" />,
      job: <Briefcase size={18} className="text-[#D97706]" />,
      connection: <Users size={18} className="text-[#059669]" />,
      message: <MessageCircle size={18} className="text-[#7C3AED]" />,
    };
    return icons[type] || <Bell size={18} className="text-[#B91C1C]" />;
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-in space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Notifications</h1>
          <p className="text-[#94A3B8] mt-1">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllNotificationsRead} className="btn btn-outline btn-sm">
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="card p-0 divide-y divide-[#F1F5F9]">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => markNotificationRead(n._id)}
            className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${
              !n.read ? 'bg-[#FEF2F2]' : 'hover:bg-[#FAFAFA]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center">
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!n.read ? 'font-semibold text-[#0F172A]' : 'text-[#334155]'}`}>
                {n.message}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">{formatTime(n.timestamp)}</p>
            </div>
            <div className="flex items-center gap-2">
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />}
              <button
                onClick={(e) => { e.stopPropagation(); dismissNotification(n._id); }}
                className="p-1 rounded hover:bg-[#FEE2E2] transition-colors"
              >
                <X size={14} className="text-[#94A3B8]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="card text-center py-16">
          <Bell size={48} className="mx-auto text-[#E2E8F0] mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No notifications</h3>
          <p className="text-[#94A3B8]">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
