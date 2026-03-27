import { useApp } from '../context/AppContext';
import { MessageCircle, Eye, Clock, Plus } from 'lucide-react';

export default function Forums() {
  const { forums } = useApp();

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--slate-900)]">Discussion Forums</h1>
          <p className="text-[var(--slate-500)] mt-2">Connect with peers and share knowledge</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> New Topic
        </button>
      </div>

      <div className="space-y-4">
        {forums.map(forum => (
          <div key={forum._id} className="card hover:border-[var(--primary)] transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <img src={forum.creatorAvatar} alt={forum.creatorName} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--slate-900)] text-lg">{forum.topic}</h3>
                <p className="text-sm text-[var(--slate-500)] mt-1">
                  Posted by {forum.creatorName} in <span className="tag tag-primary text-xs">{forum.category}</span>
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-[var(--slate-500)]">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> {forum.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {forum.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {new Date(forum.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
