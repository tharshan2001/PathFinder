import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import connectionApi from '../services/connectionApi';
import userApi from '../services/userApi';
import { Home, Bell, Briefcase, MessageSquare, User, Search, LogOut, UserPlus, Check, X, MoreHorizontal } from 'lucide-react';

const Network = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [connectionsRes, pendingRes, suggestionsRes] = await Promise.all([
        connectionApi.getConnections(),
        connectionApi.getPendingRequests(),
        userApi.getSuggestions(10)
      ]);
      setConnections(connectionsRes.data);
      setPendingRequests(pendingRes.data);
      setSuggestions(suggestionsRes.data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await connectionApi.sendRequest(userId);
      setSuggestions(suggestions.filter(s => s._id !== userId));
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAccept = async (connectionId) => {
    try {
      await connectionApi.acceptRequest(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionApi.rejectRequest(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleRemove = async (connectionId) => {
    if (!confirm('Are you sure you want to remove this connection?')) return;
    try {
      await connectionApi.removeConnection(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  const getOtherUser = (connection) => {
    const currentUserId = user?._id || user?.id;
    if (connection.requester._id === currentUserId || connection.requester._id === currentUserId) {
      return connection.recipient;
    }
    return connection.requester._id === currentUserId ? connection.recipient : connection.requester;
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

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
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
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center px-3 py-1 rounded-md transition ${
                    item.id === 'network' ? 'text-[#0a66c2]' : 'text-[#666] hover:bg-gray-100'
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
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 pb-4">
                <div className="relative -mt-8 mb-2">
                  <div className="w-16 h-16 bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="font-semibold text-[#000000e6]">{user?.name}</h3>
                <p className="text-sm text-[#666666]">{user?.headline || 'Add a headline'}</p>
                
                <div className="border-t mt-4 pt-3">
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-[#666666]">Connections</span>
                    <span className="font-semibold text-[#0a66c2]">{connections.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 ${
                    activeTab === 'connections'
                      ? 'border-[#0a66c2] text-[#0a66c2]'
                      : 'border-transparent text-[#666666] hover:text-[#0a66c2]'
                  }`}
                >
                  Connections ({connections.length})
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 ${
                    activeTab === 'requests'
                      ? 'border-[#0a66c2] text-[#0a66c2]'
                      : 'border-transparent text-[#666666] hover:text-[#0a66c2]'
                  }`}
                >
                  Pending ({pendingRequests.length})
                </button>
              </div>
            </div>

            {/* Connections List */}
            {activeTab === 'connections' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-[#000000e6]">Your Connections</h3>
                </div>
                {connections.length === 0 ? (
                  <div className="p-8 text-center text-[#666666]">
                    <User size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No connections yet</p>
                    <p className="text-sm mt-1">Start building your network by connecting with people</p>
                  </div>
                ) : (
                  <div>
                    {connections.map((connection) => {
                      const otherUser = getOtherUser(connection);
                      return (
                        <div key={connection._id} className="p-4 border-b last:border-0 flex gap-3 hover:bg-gray-50">
                          <div 
                            onClick={() => navigate(`/profile/${otherUser._id}`)}
                            className="w-14 h-14 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 cursor-pointer hover:opacity-80"
                          >
                            {otherUser?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 
                              onClick={() => navigate(`/profile/${otherUser._id}`)}
                              className="font-semibold text-[#000000e6] cursor-pointer hover:text-[#0a66c2]"
                            >
                              {otherUser?.name}
                            </h4>
                            <p className="text-sm text-[#666666] truncate">{otherUser?.headline || 'No headline'}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleRemove(connection._id)}
                                className="px-3 py-1 border border-[#666666] text-[#666666] rounded-full text-sm font-semibold hover:bg-gray-100"
                              >
                                Remove
                              </button>
                              <button className="px-3 py-1 border border-[#0a66c2] text-[#0a66c2] rounded-full text-sm font-semibold hover:bg-[#ebf4fe]">
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pending Requests */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-[#000000e6]">Pending Requests</h3>
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="p-8 text-center text-[#666666]">
                    <UserPlus size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No pending requests</p>
                    <p className="text-sm mt-1">Connection requests will appear here</p>
                  </div>
                ) : (
                  <div>
                    {pendingRequests.map((request) => (
                      <div key={request._id} className="p-4 border-b last:border-0 flex gap-3 hover:bg-gray-50">
                        <div className="w-14 h-14 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {request.requester?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#000000e6]">{request.requester?.name}</h4>
                          <p className="text-sm text-[#666666] truncate">{request.requester?.headline || 'No headline'}</p>
                          {request.message && (
                            <p className="text-sm text-[#666666] mt-1 italic">"{request.message}"</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="flex items-center gap-1 px-3 py-1 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182]"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              className="flex items-center gap-1 px-3 py-1 border border-[#666666] text-[#666666] rounded-full text-sm font-semibold hover:bg-gray-100"
                            >
                              <X size={14} /> Ignore
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-[#000000e6] mb-3">People you may know</h4>
              <div className="space-y-4">
                {suggestions.length === 0 ? (
                  <p className="text-sm text-[#666666]">No suggestions available</p>
                ) : (
                  suggestions.map((person) => (
                    <div key={person._id} className="flex gap-3">
                      <div 
                        onClick={() => navigate(`/profile/${person._id}`)}
                        className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 cursor-pointer hover:opacity-80"
                      >
                        {person.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 
                          onClick={() => navigate(`/profile/${person._id}`)}
                          className="font-semibold text-sm text-[#000000e6] truncate cursor-pointer hover:text-[#0a66c2]"
                        >
                          {person.name}
                        </h5>
                        <p className="text-xs text-[#666666] truncate">{person.headline || 'No headline'}</p>
                        {person.location && (
                          <p className="text-xs text-[#666666] truncate">{person.location}</p>
                        )}
                        <button 
                          onClick={() => handleConnect(person._id)}
                          className="mt-2 flex items-center gap-1 px-3 py-1 border border-[#0a66c2] text-[#0a66c2] rounded-full text-xs font-semibold hover:bg-[#ebf4fe]"
                        >
                          <UserPlus size={12} /> Connect
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-center px-4 mt-4">
              <p className="text-xs text-[#666666]">PathFinder © 2026</p>
              <button onClick={handleLogout} className="text-xs text-[#666666] hover:text-[#0a66c2] mt-1">Sign Out</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Network;
