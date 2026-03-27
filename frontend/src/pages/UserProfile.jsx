import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import connectionApi from '../services/connectionApi';
import chatApi from '../services/chatApi';
import { Home, Bell, Briefcase, MessageSquare, User, Search, LogOut, UserPlus, Check, X, MapPin, MoreHorizontal } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const profileRes = await userApi.getPublicProfile(userId);
      setProfile(profileRes.data);

      const connectionsRes = await connectionApi.getConnections();
      const pendingRes = await connectionApi.getPendingRequests();
      
      const isConnected = connectionsRes.data.some(conn => 
        conn.requester._id === userId || conn.recipient._id === userId
      );
      
      if (isConnected) {
        setConnectionStatus('connected');
        return;
      }

      const hasIncomingRequest = pendingRes.data.some(req => 
        req.requester._id === userId
      );
      
      if (hasIncomingRequest) {
        setConnectionStatus('pending');
        return;
      }

      setConnectionStatus(null);

    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connectionApi.sendRequest(userId);
      setConnectionStatus('sent');
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove this connection?')) return;
    try {
      const connectionsRes = await connectionApi.getConnections();
      const connection = connectionsRes.data.find(conn => 
        conn.requester._id === userId || conn.recipient._id === userId
      );
      if (connection) {
        await connectionApi.removeConnection(connection._id);
        setConnectionStatus(null);
      }
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  const handleAccept = async () => {
    try {
      const pendingRes = await connectionApi.getPendingRequests();
      const request = pendingRes.data.find(req => req.requester._id === userId);
      if (request) {
        await connectionApi.acceptRequest(request._id);
        setConnectionStatus('connected');
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleIgnore = async () => {
    try {
      const pendingRes = await connectionApi.getPendingRequests();
      const request = pendingRes.data.find(req => req.requester._id === userId);
      if (request) {
        await connectionApi.rejectRequest(request._id);
        setConnectionStatus(null);
      }
    } catch (err) {
      console.error('Error ignoring request:', err);
    }
  };

  const handleMessage = async () => {
    try {
      const res = await chatApi.createOrGetChat(userId);
      navigate('/messaging', { state: { chatId: res.data._id } });
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/feed' },
    { id: 'network', icon: User, label: 'Network', path: '/network' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/feed' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', path: '/feed' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/feed' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">User not found</h2>
          <button 
            onClick={() => navigate('/network')}
            className="mt-4 px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold"
          >
            Go to Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                ←
              </button>
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
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center px-3 py-1 rounded-md transition ${
                    item.id === 'profile' ? 'text-[#0a66c2]' : 'text-[#666] hover:bg-gray-100'
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
          {/* Left Column */}
          <div className="md:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-[#0a66c2] to-[#057642]"></div>
              
              <div className="px-4 pb-4">
                <div className="relative -mt-10 mb-2">
                  <div className="w-20 h-20 bg-white rounded-full p-1">
                    <div className="w-full h-full bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreHorizontal size={20} className="text-[#666]" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-2 z-10 min-w-[150px]">
                      <button 
                        onClick={() => { navigate('/network'); setShowMoreMenu(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        View network info
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Copy link to profile
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-[#000000e6] text-lg">{profile.name}</h3>
                <p className="text-sm text-[#666666]">{profile.headline || 'No headline'}</p>
                
                {profile.location && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-[#666666]">
                    <MapPin size={14} />
                    {profile.location}
                  </div>
                )}
                
                <div className="mt-3">
                  <span className="font-semibold text-[#0a66c2] text-sm">{profile.connectionsCount || 0} connections</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {connectionStatus === 'connected' && (
                    <>
                      <button 
                        onClick={handleMessage}
                        className="w-full py-1.5 bg-[#0a66c2] text-white rounded-full font-semibold text-sm hover:bg-[#004182]"
                      >
                        Message
                      </button>
                      <button 
                        onClick={handleRemove}
                        className="w-full py-1.5 border border-red-500 text-red-500 rounded-full font-semibold text-sm hover:bg-red-50"
                      >
                        Remove Connection
                      </button>
                    </>
                  )}

                  {connectionStatus === 'pending' && (
                    <>
                      <button 
                        onClick={handleAccept}
                        className="w-full py-1.5 bg-[#0a66c2] text-white rounded-full font-semibold text-sm hover:bg-[#004182]"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={handleIgnore}
                        className="w-full py-1.5 border border-[#666666] text-[#666666] rounded-full font-semibold text-sm hover:bg-gray-100"
                      >
                        Ignore
                      </button>
                    </>
                  )}

                  {connectionStatus === 'sent' && (
                    <button 
                      disabled
                      className="w-full py-1.5 bg-gray-200 text-gray-500 rounded-full font-semibold text-sm"
                    >
                      Request Sent
                    </button>
                  )}

                  {connectionStatus === null && (
                    <button 
                      onClick={handleConnect}
                      className="w-full py-1.5 bg-[#0a66c2] text-white rounded-full font-semibold text-sm hover:bg-[#004182]"
                    >
                      <UserPlus size={16} className="inline mr-1" /> Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-[#000000e6]">Profile viewers</h4>
                <span className="text-[#0a66c2] font-semibold text-sm">{profile.profileViews || 0}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-semibold text-[#000000e6]">Post impressions</h4>
                <span className="text-[#0a66c2] font-semibold text-sm">0</span>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-[#000000e6] mb-2">Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">About</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Help Center</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Privacy & Terms</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Ad Choices</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Advertising</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Business Services</a>
                <a href="#" className="block text-[#666666] hover:text-[#0a66c2]">Get the PathFinder app</a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-9 space-y-4">
            {/* About */}
            {profile.about && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#000000e6] mb-4">About</h2>
                <p className="text-[#00000099] whitespace-pre-wrap">{profile.about}</p>
              </div>
            )}

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#000000e6] mb-4">Experience</h2>
              {profile.experience?.length === 0 ? (
                <p className="text-[#666666]">No experience added</p>
              ) : (
                <div className="space-y-6">
                  {profile.experience.map((exp) => (
                    <div key={exp._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">💼</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#000000e6]">{exp.title}</h3>
                        <p className="text-[#00000099]">{exp.company}</p>
                        <p className="text-sm text-[#666666]">{exp.startDate?.slice(0, 7)} - {exp.endDate?.slice(0, 7) || 'Present'}</p>
                        {exp.location && <p className="text-sm text-[#666666]">{exp.location}</p>}
                        {exp.description && <p className="text-[#00000099] mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#000000e6] mb-4">Education</h2>
              {profile.education?.length === 0 ? (
                <p className="text-[#666666]">No education added</p>
              ) : (
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div key={edu._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🎓</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#000000e6]">{edu.institution}</h3>
                        <p className="text-[#00000099]">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        <p className="text-sm text-[#666666]">{edu.startDate?.slice(0, 7)} - {edu.endDate?.slice(0, 7) || 'Present'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#000000e6]">Skills</h2>
                  <span className="text-[#666666] text-sm">{profile.skills.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-[#eef3f8] text-[#0a66c2] rounded-full text-sm font-semibold"
                    >
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#000000e6] mb-4">Projects</h2>
              {profile.projects?.length === 0 ? (
                <p className="text-[#666666]">No projects added</p>
              ) : (
                <div className="space-y-6">
                  {profile.projects.map((project) => (
                    <div key={project._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📁</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#000000e6]">{project.title}</h3>
                        <p className="text-[#00000099] mt-1">{project.description}</p>
                        {project.technologies?.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#eef3f8] text-[#0a66c2] text-xs rounded-full">{tech}</span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-[#0a66c2] text-sm hover:underline"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            {profile.certifications?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#000000e6] mb-4">Certifications</h2>
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🏆</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#000000e6]">{cert.name}</h3>
                        <p className="text-[#00000099]">{cert.issuer}</p>
                        <p className="text-sm text-[#666666]">{cert.date?.slice(0, 10)}</p>
                        {cert.credentialId && (
                          <p className="text-sm text-[#666666]">Credential ID: {cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
