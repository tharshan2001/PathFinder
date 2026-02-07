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
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#FEF3C7' }}>
            <MessageCircle color="#D97706" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#0F172A' }}>Discussion Forums</h1>
            <p style={{ color: '#64748B', marginTop: '4px' }}>Ask questions and share knowledge</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          New Topic
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Career Advice'].map((cat, i) => (
          <button
            key={cat}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              background: i === 0 ? '#CCFBF1' : '#F1F5F9',
              color: i === 0 ? '#0D9488' : '#64748B',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Forum topics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredForums.map((forum) => (
          <div key={forum._id} className="card card-hover" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <img
                src={forum.creatorAvatar}
                alt={forum.creatorName}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A', marginBottom: '4px' }}>
                  {forum.topic}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#64748B' }}>
                  <span>{forum.creatorName}</span>
                  <span>•</span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '12px', background: '#F1F5F9', color: '#64748B' }}>{forum.category}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Clock size={14} />
                  <span>{formatTime(forum.lastActivity)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', fontSize: '14px', color: '#64748B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} />
                <span>{forum.replies} replies</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} />
                <span>{forum.views} views</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThumbsUp size={16} />
                <span>{Math.floor(forum.replies * 1.5)} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredForums.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <MessageCircle size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>No discussions found</h3>
          <p style={{ color: '#64748B', marginBottom: '16px' }}>Be the first to start a conversation</p>
          <button className="btn btn-primary">
            <Plus size={18} />
            Start a Discussion
          </button>
        </div>
      )}
    </div>
  );
}
