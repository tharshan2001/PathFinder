import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import connectionApi from '../services/connectionApi';
import chatApi from '../services/chatApi';
import Navbar from '../components/Navbar';
import { UserPlus, Check, X, User, MessageSquare, Trash2 } from 'lucide-react';

const Network = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
    // Ensure we have a valid string ID
    const userId = recipientId?._id || recipientId;
    if (!userId) {
      console.error('Recipient ID is missing', recipientId);
      return;
    }
    try {
      console.log('Creating chat with userId:', userId);
      const res = await chatApi.createOrGetChat(userId);
      console.log('Chat API response:', res.data);
      if (res.data && res.data._id) {
        navigate('/messaging', { state: { chatId: res.data._id, chatData: res.data } });
      } else {
        console.error('Invalid response:', res.data);
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
      // Current user is requester, return recipient
      return {
        _id: recipientId,
        name: connection.recipient?.name || 'Unknown',
        headline: connection.recipient?.headline || ''
      };
    } else {
      // Current user is recipient, return requester
      return {
        _id: requesterId,
        name: connection.requester?.name || 'Unknown',
        headline: connection.requester?.headline || ''
      };
    }
  };

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
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Network</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left - Connections & Requests */}
          <div className="md:col-span-2 space-y-4">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-semibold text-gray-900 mb-3">
                  Pending Requests ({pendingRequests.length})
                </h2>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold">
                        {request.requester?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{request.requester?.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{request.requester?.headline || 'No headline'}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAccept(request._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-full text-sm"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-600 rounded-full text-sm"
                          >
                            <X size={14} /> Ignore
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Connections */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-3">
                Connections ({connections.length})
              </h2>
              {connections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No connections yet</p>
                  <p className="text-sm">Start building your network</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connections.map((connection) => {
                    const otherUser = getOtherUser(connection);
                    return (
                      <div key={connection._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div 
                          onClick={() => navigate(`/profile/${otherUser._id}`)}
                          className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold cursor-pointer flex-shrink-0"
                        >
                          {otherUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => navigate(`/profile/${otherUser._id}`)}
                            className="font-medium text-gray-900 cursor-pointer hover:text-teal-600"
                          >
                            {otherUser?.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">{otherUser?.headline || 'No headline'}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button 
                            onClick={() => handleMessage(otherUser._id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded text-sm border border-teal-200"
                            title="Message"
                          >
                            <MessageSquare size={14} /> Message
                          </button>
                          <button 
                            onClick={() => handleRemove(connection._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right - Suggestions */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-3">People you may know</h2>
              {suggestions.length === 0 ? (
                <p className="text-sm text-gray-500">No suggestions available</p>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((person) => (
                    <div key={person._id} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        {person.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-900 truncate">{person.name}</h5>
                        <p className="text-xs text-gray-500 truncate">{person.headline || 'No headline'}</p>
                        <button 
                          onClick={() => handleConnect(person._id)}
                          className="mt-2 flex items-center gap-1 px-3 py-1 border border-teal-600 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-50"
                        >
                          <UserPlus size={12} /> Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Network;
