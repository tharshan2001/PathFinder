import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Search, Plus, MessageSquare, Eye, Clock, ThumbsUp } from 'lucide-react';

export default function Forums() {
  const { forums } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredForums = forums.filter(forum =>
    forum.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <MessageCircle className="text-amber-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Discussion Forums</h1>
            <p className="text-gray-400">Ask questions and share knowledge</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          New Topic
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Career Advice'].map((cat) => (
          <button
            key={cat}
            className={`badge ${cat === 'All' ? 'badge-primary' : 'bg-white/5 text-gray-300 hover:bg-white/10'} cursor-pointer`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Forum topics */}
      <div className="space-y-4">
        {filteredForums.map((forum) => (
          <div key={forum._id} className="card hover-lift cursor-pointer">
            <div className="flex items-start gap-4">
              <img
                src={forum.creatorAvatar}
                alt={forum.creatorName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 hover:text-indigo-400 transition-colors">
                  {forum.topic}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{forum.creatorName}</span>
                  <span>•</span>
                  <span className="badge badge-secondary text-xs">{forum.category}</span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-400">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <Clock size={14} />
                  <span>{formatTime(forum.lastActivity)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>{forum.replies} replies</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{forum.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} />
                <span>{Math.floor(forum.replies * 1.5)} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredForums.length === 0 && (
        <div className="text-center py-16 card">
          <MessageCircle size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
          <p className="text-gray-400 mb-4">Be the first to start a conversation</p>
          <button className="btn btn-primary">
            <Plus size={18} />
            Start a Discussion
          </button>
        </div>
      )}
    </div>
  );
}
