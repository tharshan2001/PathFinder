import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Home, User, Bell, Briefcase, MessageSquare, Search, Menu, Users } from 'lucide-react'
import { useState } from 'react'

const Feed = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeNav, setActiveNav] = useState('home')

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/feed' },
    { id: 'network', icon: Users, label: 'Network', path: '/network' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/feed' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', path: '/messaging' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/feed' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ]

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo */}
            <div className="flex items-center gap-4">
              <div 
                className="text-3xl font-extrabold text-[#0a66c2] cursor-pointer"
                onClick={() => navigate('/feed')}
              >
                in
              </div>
              <div className="hidden md:flex items-center bg-[#eef3f8] px-3 py-2 rounded-md">
                <Search size={18} className="text-[#666]" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-transparent border-none outline-none ml-2 w-48 text-sm"
                />
              </div>
            </div>

            {/* Right - Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id)
                    navigate(item.path)
                  }}
                  className={`flex flex-col items-center px-3 py-1 rounded-md transition ${
                    activeNav === item.id ? 'text-[#0a66c2]' : 'text-[#666] hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Sidebar - Profile Card */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-14 bg-gradient-to-r from-[#0a66c2] to-[#057642]"></div>
              
              <div className="px-4 pb-4">
                <div className="relative -mt-8 mb-3">
                  <div className="w-20 h-20 bg-white rounded-full p-1">
                    <div className="w-full h-full bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-[#000000e6]">{user?.name}</h3>
                <p className="text-sm text-[#666666]">{user?.headline || 'Add a headline'}</p>
                
                <div className="border-t mt-4 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Connections</span>
                    <span className="font-semibold text-[#0a66c2]">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Profile views</span>
                    <span className="font-semibold text-[#0a66c2]">0</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold text-sm hover:bg-[#004182] transition"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Groups Card */}
            <div className="bg-white rounded-lg shadow-sm mt-4 p-4">
              <h4 className="font-semibold text-[#000000e6] mb-3">Recent</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Users size={16} />
                  <span>Software Engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Users size={16} />
                  <span>React Developers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="md:col-span-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex-1 text-left px-4 py-3 border border-gray-300 rounded-full text-[#666] hover:bg-gray-50 transition"
                >
                  Start a post
                </button>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t">
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">📷</span>
                  <span className="text-sm font-semibold">Photo</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">🎥</span>
                  <span className="text-sm font-semibold">Video</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">📅</span>
                  <span className="text-sm font-semibold">Event</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">📝</span>
                  <span className="text-sm font-semibold">Write article</span>
                </button>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className="h-[1px] flex-1 bg-gray-300"></div>
              <span className="px-2 text-sm text-[#666]">Sort by: Top</span>
            </div>

            {/* Feed Post */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-sm">PathFinder Team</h4>
                  <p className="text-xs text-[#666666]">1,234 followers</p>
                  <p className="text-xs text-[#666666]">2h • 🌐</p>
                </div>
              </div>
              <p className="text-sm text-[#000000e6] mb-3">
                Welcome to PathFinder! Your career journey starts here. Connect with professionals, find your dream job, and grow your skills.
              </p>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gray-400">Post image</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span>👍</span>
                  <span className="text-sm font-semibold">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span>💬</span>
                  <span className="text-sm font-semibold">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span>🔁</span>
                  <span className="text-sm font-semibold">Repost</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#666] hover:bg-gray-100 rounded-lg">
                  <span>✈️</span>
                  <span className="text-sm font-semibold">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3 space-y-4">
            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-[#000000e6] mb-3">Add to your feed</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">Tech Professional</h5>
                      <p className="text-xs text-[#666666]">Software Engineer at Tech Co</p>
                      <button className="mt-2 px-3 py-1 border border-[#0a66c2] text-[#0a66c2] rounded-full text-sm font-semibold hover:bg-[#ebf4fe] transition">
                        + Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Card */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-[#000000e6] mb-3">Recommended Jobs</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                    <div>
                      <h5 className="text-sm font-semibold">Software Engineer</h5>
                      <p className="text-xs text-[#666666]">Company Name</p>
                      <p className="text-xs text-[#666666]">Remote</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-[#666666] font-semibold text-sm hover:bg-gray-100 rounded-lg">
                View all jobs
              </button>
            </div>

            {/* Footer */}
            <div className="text-center px-4">
              <p className="text-xs text-[#666666]">
                PathFinder © 2026
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <a href="#" className="text-xs text-[#666666] hover:text-[#0a66c2]">Accessibility</a>
                <a href="#" className="text-xs text-[#666666] hover:text-[#0a66c2]">Help Center</a>
                <button onClick={handleLogout} className="text-xs text-[#666666] hover:text-[#0a66c2]">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Feed
