import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import chatApi from '../services/chatApi';
import socketService from '../services/socket';
import { Home, Bell, Briefcase, MessageSquare, User, Search, LogOut, Send, ArrowLeft } from 'lucide-react';

const Messaging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id || user?.id;
  const initialChatId = location.state?.chatId;

  useEffect(() => {
    fetchChats();
    socketService.connect(currentUserId);
    
    socketService.on('newMessage', (data) => {
      const { chat, message } = data;
      
      // Update messages if this is the selected chat
      if (selectedChat?._id === chat._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      
      // Update chat list
      setChats(prev => {
        const existing = prev.find(c => c._id === chat._id);
        if (existing) {
          return prev.map(c => c._id === chat._id ? { ...c, lastMessage: message } : c);
        }
        return [chat, ...prev];
      });
    });

    return () => {
      socketService.off('newMessage');
    };
  }, [currentUserId, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await chatApi.getInbox(currentUserId);
      setChats(res.data);
      
      // If there's an initial chat ID, select it
      if (initialChatId) {
        const chat = res.data.find(c => c._id === initialChatId);
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

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/feed' },
    { id: 'network', icon: User, label: 'Network', path: '/network' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/feed' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging', path: '/messaging' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/feed' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ];

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
                    item.id === 'messaging' ? 'text-[#0a66c2]' : 'text-[#666] hover:bg-gray-100'
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
          {/* Left - Chat List */}
          <div className={`${selectedChat ? 'hidden md:block' : ''} md:col-span-4 bg-white rounded-lg shadow-sm overflow-hidden ${selectedChat ? 'md:w-full' : ''}`}>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-[#000000e6]">Messaging</h2>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {loading ? (
                <div className="p-4 text-center text-[#666666]">Loading...</div>
              ) : chats.length === 0 ? (
                <div className="p-8 text-center text-[#666666]">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start a conversation from your network</p>
                </div>
              ) : (
                chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-[#000000e6] truncate">
                              {otherUser?.name || 'Unknown User'}
                            </h4>
                            {chat.lastMessage?.createdAt && (
                              <span className="text-xs text-[#666666]">
                                {formatDate(chat.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#666666] truncate">
                            {chat.lastMessage?.text || 'No messages yet'}
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
          <div className={`${!selectedChat ? 'hidden md:block' : ''} md:col-span-8 bg-white rounded-lg shadow-sm overflow-hidden`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div 
                    onClick={() => navigate(`/profile/${getOtherUser(selectedChat)?._id}`)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
                      {getOtherUser(selectedChat)?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#000000e6]">
                        {getOtherUser(selectedChat)?.name}
                      </h3>
                      <p className="text-xs text-[#666666]">
                        {getOtherUser(selectedChat)?.headline || 'View Profile'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  className="overflow-y-auto p-4" 
                  style={{ maxHeight: 'calc(100vh - 340px)' }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-[#666666] py-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.sender === currentUserId;
                      const showDate = idx === 0 || 
                        new Date(msg.createdAt).toDateString() !== 
                        new Date(messages[idx-1].createdAt).toDateString();
                      
                      return (
                        <div key={msg._id || idx}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="text-xs text-[#666666] bg-gray-100 px-2 py-1 rounded-full">
                                {formatDate(msg.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex gap-2 mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                              <div className="w-8 h-8 bg-[#0a66c2] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                {getOtherUser(selectedChat)?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div 
                              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                isMe 
                                  ? 'bg-[#0a66c2] text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-[#000000e6] rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-[#666666]'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#0a66c2]"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-2 bg-[#0a66c2] text-white rounded-full hover:bg-[#004182] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="h-[calc(100vh-220px)] flex items-center justify-center text-[#666666]">
                <div className="text-center">
                  <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold">Select a conversation</h3>
                  <p className="text-sm mt-1">Choose from your existing conversations or start a new one</p>
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
