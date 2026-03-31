import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import connectionApi from '../services/connectionApi';
import chatApi from '../services/chatApi';
import Navbar from '../components/Navbar';
import { Check, X, MessageSquare, UserPlus, Trash2, Search } from 'lucide-react';

const Network = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [connectionsRes, pendingRes, suggestionsRes] = await Promise.all([
        connectionApi.getConnections().catch(() => ({ data: [] })),
        connectionApi.getPendingRequests().catch(() => ({ data: [] })),
        connectionApi.getSuggestions(10).catch(() => ({ data: [] })),
      ]);
      setConnections(connectionsRes.data || []);
      setPendingRequests(pendingRes.data || []);
      setSuggestions(suggestionsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await connectionApi.acceptRequest(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error accepting:', err);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionApi.rejectRequest(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error rejecting:', err);
    }
  };

  const handleRemove = async (connectionId) => {
    if (!confirm('Remove this connection?')) return;
    try {
      await connectionApi.removeConnection(connectionId);
      fetchData();
    } catch (err) {
      console.error('Error removing:', err);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await connectionApi.sendRequest(userId);
      setSuggestions(suggestions.filter(s => s._id !== userId));
    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const handleMessage = async (recipientId) => {
    const userId = recipientId?._id || recipientId;
    if (!userId) return;
    try {
      const res = await chatApi.createOrGetChat(userId);
      if (res.data && res.data._id) {
        navigate('/messaging', { state: { chatId: res.data._id, chatData: res.data } });
      }
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  const getOtherUser = (connection) => {
    const currentUserId = user?._id || user?.id;
    const requesterId = connection.requester?._id || connection.requester;
    const recipientId = connection.recipient?._id || connection.recipient;
    
    if (requesterId === currentUserId) {
      return {
        _id: recipientId,
        name: connection.recipient?.name || 'Unknown',
        headline: connection.recipient?.headline || ''
      };
    }
    return {
      _id: requesterId,
      name: connection.requester?.name || 'Unknown',
      headline: connection.requester?.headline || ''
    };
  };

  const filteredConnections = connections.filter(conn => {
    const other = getOtherUser(conn);
    return other.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            {/* Pending Invitations */}
            {pendingRequests.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Pending Invitations</h2>
                  <button className="text-sm text-teal-600 font-semibold hover:underline">Manage All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-lg">
                          {request.requester?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{request.requester?.name}</h4>
                          <p className="text-sm text-gray-500">{request.requester?.headline || 'No headline'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReject(request._id)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200"
                        >
                          Ignore
                        </button>
                        <button 
                          onClick={() => handleAccept(request._id)}
                          className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Connections */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* My Connections */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">My Connections ({connections.length})</h2>
              {filteredConnections.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500">No connections yet</p>
                  <p className="text-sm text-gray-400">Start building your network</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConnections.map((connection) => {
                    const otherUser = getOtherUser(connection);
                    return (
                      <div key={connection._id} className="bg-white rounded-xl p-5 shadow-sm text-center flex flex-col items-center border border-transparent hover:border-teal-200 transition-all group">
                        <div 
                          onClick={() => navigate(`/profile/${otherUser._id}`)}
                          className="w-20 h-20 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-2xl">
                            {otherUser?.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <h4 
                          onClick={() => navigate(`/profile/${otherUser._id}`)}
                          className="font-bold text-gray-900 cursor-pointer hover:text-teal-600"
                        >
                          {otherUser?.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">{otherUser?.headline || 'No headline'}</p>
                        <button 
                          onClick={() => handleMessage(otherUser._id)}
                          className="mt-auto w-full py-2 border border-teal-600 text-teal-600 text-sm font-semibold rounded-lg hover:bg-teal-50"
                        >
                          Message
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* People You May Know */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">People You May Know</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {suggestions.map((person) => (
                    <div key={person._id} className="bg-white rounded-xl p-5 shadow-sm text-center flex flex-col items-center border border-transparent hover:border-teal-200 transition-all group">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-2xl">
                          {person.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-500 mb-4">{person.headline || 'No headline'}</p>
                      <button 
                        onClick={() => handleConnect(person._id)}
                        className="mt-auto w-full py-2 border border-teal-600 text-teal-600 text-sm font-semibold rounded-lg hover:bg-teal-50"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            {/* Similar Profiles */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-6">Similar Profiles</h3>
              <div className="space-y-6">
                {connections.slice(0, 3).map((connection) => {
                  const otherUser = getOtherUser(connection);
                  return (
                    <div key={connection._id} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold flex-shrink-0">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{otherUser?.name}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight">{otherUser?.headline || 'No headline'}</p>
                        <button 
                          onClick={() => handleMessage(otherUser._id)}
                          className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-teal-600 hover:text-teal-700"
                        >
                          <UserPlus size={12} /> Connect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 flex flex-wrap gap-x-4 gap-y-2 opacity-50 text-xs">
              <a className="font-medium hover:text-teal-600" href="#">About</a>
              <a className="font-medium hover:text-teal-600" href="#">Privacy</a>
              <a className="font-medium hover:text-teal-600" href="#">Accessibility</a>
              <a className="font-medium hover:text-teal-600" href="#">Help Center</a>
              <p className="w-full mt-2">© 2026 PathFinder</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Network;