import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BookOpen,
  ChevronDown,
  Sparkles,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { user, unreadNotificationCount, unreadMessageCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/connections', icon: Users, label: 'Network' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/courses', icon: BookOpen, label: 'Learning' },
    { path: '/messages', icon: MessageSquare, label: 'Messages', badge: unreadMessageCount },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadNotificationCount },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0]">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between h-[60px]">
          {/* Left section - Logo and search */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center">
                <Compass className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold text-[#0F172A] hidden md:block">PathFinder</span>
            </Link>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search courses, jobs, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-[300px]"
              />
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-4 h-[60px] min-w-[70px] border-b-2 transition-colors ${
                  isActive(item.path)
                    ? 'border-[#0D9488] text-[#0D9488]'
                    : 'border-transparent text-[#64748B] hover:text-[#0D9488]'
                }`}
              >
                <div className="relative">
                  <item.icon size={22} strokeWidth={isActive(item.path) ? 2 : 1.5} />
                  {item.badge > 0 && (
                    <span className="notification-badge">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 hidden lg:block font-medium">{item.label}</span>
              </Link>
            ))}

            {/* User menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex flex-col items-center justify-center px-3 h-[60px] border-b-2 transition-colors ${
                  showUserMenu
                    ? 'border-[#0D9488] text-[#0D9488]'
                    : 'border-transparent text-[#64748B] hover:text-[#0D9488]'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border-2 border-[#0D9488]"
                />
                <div className="flex items-center gap-0.5 mt-1 hidden lg:flex">
                  <span className="text-xs font-medium">Me</span>
                  <ChevronDown size={12} />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-0 w-[280px] dropdown p-0 animate-fadeIn">
                  {/* User info */}
                  <div className="p-4 border-b border-[#E2E8F0]">
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-full border-2 border-[#0D9488]"
                      />
                      <div>
                        <p className="font-semibold text-[#0F172A]">{user.name}</p>
                        <p className="text-sm text-[#64748B]">Software Developer</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="btn btn-secondary w-full mt-3 text-sm"
                      onClick={() => setShowUserMenu(false)}
                    >
                      View Profile
                    </Link>
                  </div>
                  
                  {/* Account section */}
                  <div className="py-2 border-b border-[#E2E8F0]">
                    <p className="px-4 py-1 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Account</p>
                    <Link
                      to="/saved"
                      className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-[#CCFBF1] hover:text-[#0D9488]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Saved Items
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-[#CCFBF1] hover:text-[#0D9488]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/recommendations"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#CCFBF1] hover:text-[#0D9488]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Sparkles size={14} className="text-[#7C3AED]" />
                      AI Recommendations
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-[#0F172A] hover:bg-[#CCFBF1] hover:text-[#0D9488]"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
