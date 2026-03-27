import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  Bell,
  Bookmark,
  TrendingUp,
  MessageCircle,
  Compass,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { trends } = useApp();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/dashboard', icon: Compass, label: 'Dashboard' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/learning-path', icon: TrendingUp, label: 'Learning Paths' },
    { path: '/connections', icon: Users, label: 'Network' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/recommendations', icon: Sparkles, label: 'Recommendations' },
    { path: '/forums', icon: MessageCircle, label: 'Forums' },
  ];

  return (
    <aside className="fixed left-0 top-[60px] w-[240px] h-[calc(100vh-60px)] bg-white border-r border-[var(--slate-300)] p-4 overflow-y-auto">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {isActive(item.path) && <ChevronRight size={16} className="ml-auto" />}
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[var(--slate-300)]">
        <h3 className="text-xs font-semibold text-[var(--slate-500)] uppercase tracking-wide mb-3 px-3">
          Trending Skills
        </h3>
        <div className="space-y-2">
          {trends.slice(0, 5).map((trend) => (
            <div
              key={trend._id}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--slate-100)] cursor-pointer transition-colors"
            >
              <span className="text-sm text-[var(--slate-700)]">{trend.skill}</span>
              <span className="text-xs font-medium text-[var(--emerald)]">{trend.growth}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
