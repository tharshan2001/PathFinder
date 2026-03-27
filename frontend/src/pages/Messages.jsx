import { useApp } from '../context/AppContext';
import { MessageSquare, Send } from 'lucide-react';

export default function Messages() {
  const { messages } = useApp();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Messages</h1>
        <p className="text-[var(--slate-500)] mt-2">Chat with your connections</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 card">
          <h2 className="font-semibold text-[var(--slate-900)] mb-4">Conversations</h2>
          <div className="space-y-2">
            {messages.map(msg => (
              <div key={msg._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--slate-50)] cursor-pointer">
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--slate-900)]">{msg.senderName}</p>
                  <p className="text-sm text-[var(--slate-500)] truncate">{msg.lastMessage}</p>
                </div>
                {msg.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center">
                    {msg.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 card flex flex-col">
          <div className="flex-1 flex items-center justify-center text-[var(--slate-400)]">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
