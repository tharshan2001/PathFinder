import { useApp } from '../context/AppContext';
import { Bell, Check, Briefcase, BookOpen, Users, Award } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();

  const getIcon = (type) => {
    switch(type) {
      case 'job': return Briefcase;
      case 'course': return BookOpen;
      case 'connection': return Users;
      case 'achievement': return Award;
      default: return Bell;
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case 'job': return 'bg-blue-100 text-[var(--blue)]';
      case 'course': return 'bg-[var(--primary-light)] text-[var(--primary)]';
      case 'connection': return 'bg-purple-100 text-[var(--purple)]';
      case 'achievement': return 'bg-amber-100 text-[var(--amber)]';
      default: return 'bg-[var(--slate-100)] text-[var(--slate-500)]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Notifications</h1>
        <p className="text-[var(--slate-500)] mt-2">Stay updated with your activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => {
          const Icon = getIcon(notif.type);
          return (
            <div 
              key={notif._id} 
              className={`card flex items-start gap-4 ${!notif.readStatus ? 'bg-[var(--primary-light)]/30 border-l-4 border-[var(--primary)]' : ''}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg(notif.type)}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className={`${!notif.readStatus ? 'font-semibold' : ''} text-[var(--slate-900)]`}>{notif.message}</p>
                <p className="text-xs text-[var(--slate-500)] mt-1">
                  {new Date(notif.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!notif.readStatus && (
                <button 
                  onClick={() => markNotificationRead(notif._id)}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
