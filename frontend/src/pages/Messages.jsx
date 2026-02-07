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
    <div className="animate-in" style={{ height: 'calc(100vh - 96px)' }}>
      <div className="card" style={{ padding: 0, height: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '300px', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: '#F1F5F9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                style={{
                  width: '100%',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  border: 'none',
                  background: selectedChat?._id === chat._id ? '#F0FDFA' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={chat.senderAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#059669', border: '2px solid white', borderRadius: '50%' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: chat.unread ? 600 : 500, color: '#0F172A' }}>{chat.senderName}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span style={{ width: '20px', height: '20px', background: '#0D9488', color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        {selectedChat ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={selectedChat.senderAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <p style={{ fontWeight: 600, color: '#0F172A' }}>{selectedChat.senderName}</p>
                <p style={{ fontSize: '12px', color: '#059669' }}>Online</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.sender === 'me' ? '16px' : '4px',
                    background: msg.sender === 'me' ? '#0D9488' : 'white',
                    color: msg.sender === 'me' ? 'white' : '#0F172A',
                    border: msg.sender === 'me' ? 'none' : '1px solid #E2E8F0',
                  }}>
                    <p style={{ fontSize: '14px' }}>{msg.text}</p>
                    <p style={{ fontSize: '11px', marginTop: '4px', opacity: msg.sender === 'me' ? 0.7 : 0.6 }}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#F1F5F9',
                  borderRadius: '12px',
                  fontSize: '14px',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary" style={{ padding: '12px 16px' }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <div style={{ textAlign: 'center' }}>
              <Send size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748B' }}>Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
