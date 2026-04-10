import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import userApi from '../services/userApi';
import connectionApi from '../services/connectionApi';
import chatApi from '../services/chatApi';

import { UserPlus, Check, X, MapPin, MoreHorizontal, FileText, Download } from 'lucide-react';

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
      if (res.data && res.data._id) {
        navigate('/messaging', { state: { chatId: res.data._id, chatData: res.data } });
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005eb5]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">User not found</h2>
          <button 
            onClick={() => navigate('/network')}
            className="mt-4 px-4 py-2 bg-[#005eb5] text-white rounded-full font-semibold"
          >
            Go to Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1128px] mx-auto px-4 py-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-[#005eb5] to-[#004c99]"></div>
              
              <div className="px-4 pb-4">
                <div className="relative -mt-10 mb-2">
                  <div className="w-20 h-20 bg-white rounded-full p-1">
                    <div className="w-full h-full bg-[#005eb5] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreHorizontal size={20} className="text-gray-500" />
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
                
                <h3 className="font-semibold text-gray-900 text-lg">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.headline || 'No headline'}</p>
                
                {profile.location && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {profile.location}
                  </div>
                )}
                
                <div className="mt-3">
                  <span className="font-semibold text-[#005eb5] text-sm">{profile.connectionsCount || 0} connections</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {connectionStatus === 'connected' && (
                    <>
                      <button 
                        onClick={handleMessage}
                        className="w-full py-1.5 bg-[#005eb5] text-white rounded-full font-semibold text-sm hover:bg-[#004c99]"
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
                        className="w-full py-1.5 bg-[#005eb5] text-white rounded-full font-semibold text-sm hover:bg-[#004c99]"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={handleIgnore}
                        className="w-full py-1.5 border border-gray-400 text-gray-600 rounded-full font-semibold text-sm hover:bg-gray-100"
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
                      className="w-full py-1.5 bg-[#005eb5] text-white rounded-full font-semibold text-sm hover:bg-[#004c99]"
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
                <h4 className="font-semibold text-gray-900">Profile viewers</h4>
                <span className="text-[#005eb5] font-semibold text-sm">{profile.profileViews || 0}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h4 className="font-semibold text-gray-900">Post impressions</h4>
                <span className="text-[#005eb5] font-semibold text-sm">0</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-9 space-y-4">
            {/* About */}
            {profile.about && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{profile.about}</p>
              </div>
            )}

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
              {profile.experience?.length === 0 ? (
                <p className="text-gray-500">No experience added</p>
              ) : (
                <div className="space-y-6">
                  {profile.experience.map((exp) => (
                    <div key={exp._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">💼</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.startDate?.slice(0, 7)} - {exp.endDate?.slice(0, 7) || 'Present'}</p>
                        {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              {profile.education?.length === 0 ? (
                <p className="text-gray-500">No education added</p>
              ) : (
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div key={edu._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🎓</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                        <p className="text-gray-600">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                        <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
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
                  <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                  <span className="text-gray-500 text-sm">{profile.skills.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-[#d6e3ff] text-[#004c99] rounded-full text-sm font-semibold"
                    >
                      {skill?.skill || skill?.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
              {profile.projects?.length === 0 ? (
                <p className="text-gray-500">No projects added</p>
              ) : (
                <div className="space-y-6">
                  {profile.projects.map((project) => (
                    <div key={project._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📁</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                        {project.technologies?.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#d6e3ff] text-[#004c99] text-xs rounded-full">{tech}</span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-[#005eb5] text-sm hover:underline"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🏆</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.date?.slice(0, 10)}</p>
                        {cert.credentialId && (
                          <p className="text-sm text-gray-500">Credential ID: {cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumes */}
            {profile.resumes?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumes</h2>
                <div className="space-y-3">
                  {profile.resumes.map((resume) => (
                    <div key={resume._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{resume.fileName}</p>
                          <p className="text-xs text-gray-500">{new Date(resume.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {resume.fileUrl && (
                        <a 
                          href={resume.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#005eb5] hover:text-[#004c99]"
                        >
                          <Download size={18} />
                        </a>
                      )}
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
