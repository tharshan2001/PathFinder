import { useApp } from '../context/AppContext';
import { Users, UserPlus, Check, Clock } from 'lucide-react';

export default function Connections() {
  const { connections, user } = useApp();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-[var(--slate-900)]">Your Network</h1>
        <p className="text-[var(--slate-500)] mt-2">You have {user.connections} connections</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {connections.map(conn => (
          <div key={conn._id} className="card flex items-center gap-4">
            <img src={conn.avatar} alt={conn.name} className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--slate-900)]">{conn.name}</h3>
              <p className="text-sm text-[var(--slate-500)]">{conn.title}</p>
              <p className="text-sm text-[var(--slate-500)]">{conn.company}</p>
              <p className="text-xs text-[var(--slate-400)] mt-1">{conn.mutualConnections} mutual connections</p>
            </div>
            {conn.status === 'connected' ? (
              <button className="btn btn-outline btn-sm">
                <Check size={16} />
                Connected
              </button>
            ) : (
              <button className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                Accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
