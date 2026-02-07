import { useApp } from '../context/AppContext';
import { Search, UserPlus, MessageCircle } from 'lucide-react';

export default function Connections() {
  const { connections } = useApp();
  const connected = connections.filter(c => c.status === 'connected');
  const pending = connections.filter(c => c.status === 'pending');

  return (
    <div className="animate-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Network</h1>
          <p className="text-[#94A3B8] mt-1">{connected.length} connections</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} />
          Find People
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search connections..."
            className="input pl-11"
          />
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Pending ({pending.length})</h2>
          <div className="grid grid-cols-2 gap-4">
            {pending.map((c) => (
              <div key={c._id} className="card flex items-center gap-4">
                <img src={c.avatar} alt="" className="w-14 h-14 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0F172A]">{c.name}</p>
                  <p className="text-sm text-[#94A3B8] line-clamp-1">{c.title}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm">Ignore</button>
                  <button className="btn btn-primary btn-sm">Accept</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected */}
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Your Connections</h2>
        <div className="grid grid-cols-2 gap-4">
          {connected.map((c) => (
            <div key={c._id} className="card card-hover flex items-center gap-4">
              <img src={c.avatar} alt="" className="w-14 h-14 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0F172A]">{c.name}</p>
                <p className="text-sm text-[#94A3B8] line-clamp-1">{c.title}</p>
                <p className="text-xs text-[#0284C7]">{c.company}</p>
              </div>
              <button className="btn btn-outline btn-sm">
                <MessageCircle size={14} />
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
