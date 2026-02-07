import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  BookOpen,
  Briefcase,
  Compass,
  BarChart2,
  Bookmark,
  Bell,
  MessageCircle,
  Users,
  HelpCircle,
  Settings,
  Flame
} from 'lucide-react';

export default function Sidebar() {
  const { user, unreadNotificationCount, unreadMessageCount } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const mainNav = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/recommendations', icon: Compass, label: 'For You' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  const secondaryNav = [
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadNotificationCount },
    { path: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadMessageCount },
    { path: '/connections', icon: Users, label: 'Network' },
  ];

  const navLinkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    color: active ? '#B91C1C' : '#334155',
    fontWeight: 500,
    textDecoration: 'none',
    background: active ? '#FEE2E2' : 'transparent',
    transition: 'all 0.15s ease',
  });

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '260px',
      background: 'white',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #B91C1C, #991B1B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame color="white" size={22} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>PathFinder</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {mainNav.map((item) => (
            <Link key={item.path} to={item.path} style={navLinkStyle(isActive(item.path))}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ height: '1px', background: '#E2E8F0', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {secondaryNav.map((item) => (
            <Link key={item.path} to={item.path} style={navLinkStyle(isActive(item.path))}>
              <item.icon size={20} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: '#B91C1C',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div style={{ height: '1px', background: '#E2E8F0', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link to="/forums" style={navLinkStyle(isActive('/forums'))}>
            <HelpCircle size={20} />
            <span>Help & Forums</span>
          </Link>
          <button style={{ ...navLinkStyle(false), border: 'none', cursor: 'pointer', width: '100%' }}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0' }}>
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background 0.15s ease',
          }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: '#0F172A',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user.name}
            </p>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>View profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
