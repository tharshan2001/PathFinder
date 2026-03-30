import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Navbar from '../components/Navbar'
import { Users, Heart, Repeat, MessageCircle, Send } from 'lucide-react'

const Feed = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-teal-500 to-teal-700"></div>
              
              <div className="px-4 pb-4">
                <div className="relative -mt-10 mb-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.headline || 'Add a headline'}</p>
                
                <div className="mt-4 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Connections</span>
                    <span className="text-teal-600 font-semibold">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profile views</span>
                    <span className="text-teal-600 font-semibold">0</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-4 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Groups */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Recent Groups</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>Software Engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>React Developers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="md:col-span-6 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
                >
                  Start a post
                </button>
              </div>
              <div className="flex justify-center mt-3 pt-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <span className="text-xl">📷</span>
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <span className="text-xl">🎥</span>
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <span className="text-xl">📅</span>
                  <span className="text-sm font-medium">Event</span>
                </button>
              </div>
            </div>

            {/* Feed Post */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">PathFinder Team</h4>
                  <p className="text-xs text-gray-500">1,234 followers</p>
                  <p className="text-xs text-gray-400">2h • 🌐</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Welcome to PathFinder! Your career journey starts here. Connect with professionals, find your dream job, and grow your skills.
              </p>
              <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center mb-3">
                <span className="text-gray-400">Post image</span>
              </div>
              <div className="flex justify-between pt-2">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Heart size={18} />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Repeat size={18} />
                  <span className="text-sm font-medium">Repost</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Send size={18} />
                  <span className="text-sm font-medium">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3 space-y-4">
            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">People you may know</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-sm">Tech Professional</h5>
                      <p className="text-xs text-gray-500">Software Engineer</p>
                      <button className="mt-2 px-3 py-1 border border-teal-600 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-50 transition">
                        + Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Jobs</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0"></div>
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">Software Engineer</h5>
                      <p className="text-xs text-gray-500">Company Name • Remote</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-gray-600 font-medium text-sm hover:bg-gray-100 rounded-lg transition">
                View all jobs
              </button>
            </div>

            {/* Footer */}
            <div className="text-center px-4">
              <p className="text-xs text-gray-400">PathFinder © 2026</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Feed
