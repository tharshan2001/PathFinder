import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import chatApi from '../services/chatApi';
import socketService from '../services/socket';

import { Search, Send, ArrowLeft, Phone, Video, MoreVertical, Smile, MessageSquare, Circle } from 'lucide-react';

const Messaging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  // Keep ref in sync with state
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    fetchChats();
    socketService.connect(currentUserId);
    
    const handleNewMessage = (data) => {
      const { chat, message } = data;
      
      if (selectedChatRef.current?._id === chat._id) {
        // Prevent duplicate messages by ID
        setMessages(prev => {
          if (!message._id) return prev;
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();
      }
      
      setChats(prev => {
        const existing = prev.find(c => c._id === chat._id);
        if (existing) {
          return prev.map(c => c._id === chat._id ? { ...c, lastMessage: message } : c);
        }
        return [chat, ...prev];
      });
    };

    socketService.on('newMessage', handleNewMessage);

    const handleUserOnline = (data) => {
      if (selectedChatRef.current) {
        const otherUser = getOtherUser(selectedChatRef.current);
        if (otherUser && (otherUser._id || otherUser) === data.userId) {
          setOtherUserOnline(true);
        }
      }
    };

    const handleUserOffline = (data) => {
      if (selectedChatRef.current) {
        const otherUser = getOtherUser(selectedChatRef.current);
        if (otherUser && (otherUser._id || otherUser) === data.userId) {
          setOtherUserOnline(false);
        }
      }
    };

    socketService.on('userOnline', handleUserOnline);
    socketService.on('userOffline', handleUserOffline);

    return () => {
      socketService.off('newMessage');
      socketService.off('userOnline');
      socketService.off('userOffline');
    };
  }, []);

  // Handle navigation to specific chat
  useEffect(() => {
    const chatIdFromState = location.state?.chatId;
    const chatFromState = location.state?.chatData;
    
    if (chatIdFromState) {
      // First try to find in existing chats
      const existingChat = chats.find(c => c._id === chatIdFromState);
      if (existingChat) {
        setSelectedChat(existingChat);
      } else if (chatFromState) {
        // Use chat data from navigation state
        setSelectedChat(chatFromState);
        // Add to chats list
        setChats(prev => [...prev, chatFromState]);
      } else {
        // Chat might be new, set selected with minimal data
        setSelectedChat({ _id: chatIdFromState, participants: [] });
      }
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, chats, navigate]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      const otherUser = getOtherUser(selectedChat);
      if (otherUser) {
        const otherUserId = otherUser._id || otherUser;
        setOtherUserOnline(socketService.isOnline(otherUserId));
      }
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await chatApi.getInbox(currentUserId);
      setChats(res.data);
      
      // Handle initial chat from navigation
      const chatIdFromState = location.state?.chatId;
      if (chatIdFromState) {
        const chat = res.data.find(c => c._id === chatIdFromState);
        if (chat) {
          setSelectedChat(chat);
        }
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await chatApi.getMessages(chatId);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      await chatApi.sendMessage(selectedChat._id, newMessage.trim());
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (chat) => {
    return chat.participants?.find(p => (p._id || p) !== currentUserId);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatChatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherUser(chat);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-[550px] bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          {/* Left - Chat List */}
          <div className={`${selectedChat ? 'hidden md:block' : ''} md:col-span-4 bg-white rounded-2xl overflow-hidden shadow-sm`}>
            {/* Search Header */}
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005eb5] transition"
                />
              </div>
            </div>
            
            {/* Chat List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredChats.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start chatting with your network</p>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer transition ${
                          selectedChat?._id === chat._id 
                              ? 'bg-[#d6e3ff]' 
                              : 'hover:bg-gray-50'
                          }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#005eb5] to-[#005eb5] rounded-full flex items-center justify-center text-white font-bold">
                            {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {otherUser?.name || 'Unknown User'}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {formatChatTime(chat.lastMessage?.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {chat.lastMessage?.text || 'Start a conversation'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right - Chat Window */}
          <div className={`${!selectedChat ? 'hidden md:flex' : ''} md:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm flex-col h-full`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div 
                      onClick={() => navigate(`/profile/${getOtherUser(selectedChat)?._id}`)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#005eb5] to-[#005eb5] rounded-full flex items-center justify-center text-white font-bold">
                          {getOtherUser(selectedChat)?.name?.charAt(0).toUpperCase()}
                        </div>
                        {otherUserOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {getOtherUser(selectedChat)?.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {otherUserOnline ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Circle size={8} fill="currentColor" /> Online
                            </span>
                          ) : getOtherUser(selectedChat)?.headline || 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Phone size={20} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Video size={20} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-280px)]">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#d6e3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={40} className="text-[#005eb5]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Start the conversation</h3>
                      <p className="text-gray-500 text-sm mt-1">Send a message to {getOtherUser(selectedChat)?.name}</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.sender === currentUserId;
                      
                      return (
                        <div 
                          key={msg._id || idx} 
                          className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <div className="w-8 h-8 bg-gradient-to-br from-[#005eb5] to-[#005eb5] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-auto">
                              {getOtherUser(selectedChat)?.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div 
                            className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              isMe 
                                ? 'bg-[#005eb5] text-white rounded-br-md' 
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-[#d6e3ff]' : 'text-gray-400'}`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="sticky bottom-0 flex-shrink-0 border-t border-gray-100 bg-white z-10">
                  <form onSubmit={handleSendMessage} className="p-4 pb-6 md:pb-4">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">
                      <button type="button" className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                        <Smile size={24} />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 py-2 min-w-0"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="flex-shrink-0 p-2 bg-[#005eb5] text-white rounded-xl hover:bg-[#004c99] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#d6e3ff] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={48} className="text-[#005eb5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h3>
                  <p className="text-gray-500 max-w-md">
                    Select a conversation from the list or start a new one by connecting with someone in your network
                  </p>
                  <button 
                    onClick={() => navigate('/network')}
                    className="mt-6 px-6 py-3 bg-[#005eb5] text-white font-semibold rounded-xl hover:bg-[#004c99] transition"
                  >
                    Explore Network
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messaging;
