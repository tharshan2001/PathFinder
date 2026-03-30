import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import connectionApi from '../services/connectionApi';
import userApi from '../services/userApi';
import Navbar from '../components/Navbar';
import { UserPlus, Check, X, User } from 'lucide-react';

const Network = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const connectionsRes = await connectionApi.getConnections().catch(() => ({ data: [] }));
      const pendingRes = await connectionApi.getPendingRequests().catch(() => ({ data: [] }));
      const suggestionsRes = await userApi.getSuggestions(10).catch(() => ({ data: [] }));
      
      setConnections(connectionsRes.data || []);
      setPendingRequests(pendingRes.data || []);
      setSuggestions(suggestionsRes.data || []);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError(err.message);
      setConnections([]);
      setPendingRequests([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
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

  const handleConnect = async (userId) => {
    try {
      await connectionApi.sendRequest(userId);
      setSuggestions(suggestions.filter(s => s._id !== userId));
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  const getOtherUser = (connection) => {
    const currentUserId = user?._id || user?.id;
    if (connection.requester._id === currentUserId || connection.requester._id === currentUserId) {
      return connection.recipient;
    }
    return connection.requester._id === currentUserId ? connection.recipient : connection.requester;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={fetchData} className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-full">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="relative -mt-6 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.headline || 'Add a headline'}</p>
              
              <div className="mt-4 pt-3">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Connections</span>
                  <span className="text-teal-600 font-semibold">{connections.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl mb-4 shadow-sm">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-t-2xl ${
                    activeTab === 'connections'
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Connections ({connections.length})
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold rounded-t-2xl ${
                    activeTab === 'requests'
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Pending ({pendingRequests.length})
                </button>
              </div>
            </div>

            {/* Connections List */}
            {activeTab === 'connections' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {connections.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No connections yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start building your network</p>
                  </div>
                ) : (
                  <div>
                    {connections.map((connection) => {
                      const otherUser = getOtherUser(connection);
                      return (
                        <div key={connection._id} className="p-4 flex gap-3 hover:bg-gray-50 transition">
                          <div 
                            onClick={() => navigate(`/profile/${otherUser._id}`)}
                            className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 cursor-pointer"
                          >
                            {otherUser?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 
                              onClick={() => navigate(`/profile/${otherUser._id}`)}
                              className="font-semibold text-gray-900 cursor-pointer hover:text-teal-600"
                            >
                              {otherUser?.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">{otherUser?.headline || 'No headline'}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleRemove(connection._id)}
                                className="px-3 py-1 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition"
                              >
                                Remove
                              </button>
                              <button className="px-3 py-1 border border-teal-600 text-teal-600 rounded-full text-sm font-medium hover:bg-teal-50 transition">
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
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {pendingRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                ) : (
                  <div>
                    {pendingRequests.map((request) => (
                      <div key={request._id} className="p-4 flex gap-3 hover:bg-gray-50 transition">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {request.requester?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{request.requester?.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{request.requester?.headline || 'No headline'}</p>
                          {request.message && (
                            <p className="text-sm text-gray-400 mt-1 italic">"{request.message}"</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700 transition"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              className="flex items-center gap-1 px-3 py-1 border border-gray-400 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition"
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
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">People you may know</h4>
              <div className="space-y-4">
                {suggestions.length === 0 ? (
                  <p className="text-sm text-gray-500">No suggestions</p>
                ) : (
                  suggestions.map((person) => (
                    <div key={person._id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {person.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 text-sm truncate">
                          {person.name}
                        </h5>
                        <p className="text-xs text-gray-500 truncate">{person.headline || 'No headline'}</p>
                        <button 
                          onClick={() => handleConnect(person._id)}
                          className="mt-2 flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-100"
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
              <p className="text-xs text-gray-400">PathFinder © 2026</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Network;
