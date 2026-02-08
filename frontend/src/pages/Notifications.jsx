import { useApp } from '../context/AppContext';
import { Bell, Check, X, BookOpen, Briefcase, Users, MessageCircle } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, dismissNotification, markAllNotificationsRead } = useApp();

  const getIcon = (type) => {
    const icons = {
      course: <BookOpen size={18} color="var(--blue)" />,
      job: <Briefcase size={18} color="var(--amber)" />,
      connection: <Users size={18} color="var(--emerald)" />,
      message: <MessageCircle size={18} color="var(--purple)" />,
    };
    return icons[type] || <Bell size={18} color="var(--primary)" />;
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
    <div className="animate-in" style={{ maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--slate-900)' }}>Notifications</h1>
          <p style={{ color: 'var(--slate-500)', marginTop: '4px' }}>
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
      <div className="card" style={{ padding: 0 }}>
        {notifications.map((n, index) => (
          <div
            key={n._id}
            onClick={() => markNotificationRead(n._id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px',
              cursor: 'pointer',
              background: !n.read ? 'var(--slate-50)' : 'transparent',
              borderBottom: index < notifications.length - 1 ? '1px solid var(--slate-100)' : 'none',
              transition: 'background 0.15s ease',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              border: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {getIcon(n.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', color: !n.read ? 'var(--slate-900)' : 'var(--slate-500)', fontWeight: !n.read ? 600 : 400 }}>
                {n.message}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--slate-400)', marginTop: '4px' }}>{formatTime(n.timestamp)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
              <button
                onClick={(e) => { e.stopPropagation(); dismissNotification(n._id); }}
                style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={14} color="var(--slate-400)" />
              </button>
            </div>
          </div>
        ))}
      </div>

        {notifications.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <Bell size={48} color="var(--slate-200)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '8px' }}>No notifications</h3>
          <p style={{ color: 'var(--slate-500)' }}>You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
