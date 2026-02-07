import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Search } from 'lucide-react';

export default function Messages() {
  const { messages } = useApp();
  const [selectedChat, setSelectedChat] = useState(messages[0] || null);
  const [newMessage, setNewMessage] = useState('');

  const chatMessages = [
    { id: 1, sender: 'them', text: 'Hi! I saw you completed the React course. How was it?', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'It was great! Very comprehensive and practical.', time: '10:32 AM' },
    { id: 3, sender: 'them', text: 'That\'s awesome! I might enroll too. Any tips?', time: '10:35 AM' },
  ];

  return (
    <div className="animate-in h-[calc(100vh-80px)]">
      <div className="card p-0 h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] border-r border-[#E2E8F0] flex flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#B91C1C]/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 flex items-center gap-3 text-left hover:bg-[#F1F5F9] transition-colors ${
                  selectedChat?._id === chat._id ? 'bg-[#FEE2E2]' : ''
                }`}
              >
                <div className="relative">
                  <img src={chat.senderAvatar} alt="" className="w-10 h-10 rounded-full" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#059669] border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${chat.unread ? 'font-semibold text-[#0F172A]' : 'text-[#334155]'}`}>
                    {chat.senderName}
                  </p>
                  <p className="text-xs text-[#94A3B8] truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 bg-[#B91C1C] text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <img src={selectedChat.senderAvatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-[#0F172A]">{selectedChat.senderName}</p>
                <p className="text-xs text-[#059669]">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'me' 
                      ? 'bg-[#B91C1C] text-white rounded-br-md' 
                      : 'bg-white border border-[#E2E8F0] rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E2E8F0]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-[#F1F5F9] rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#B91C1C]/20"
                />
                <button className="btn btn-primary px-4">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
            <div className="text-center">
              <Send size={48} className="mx-auto text-[#E2E8F0] mb-4" />
              <p className="text-[#94A3B8]">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
