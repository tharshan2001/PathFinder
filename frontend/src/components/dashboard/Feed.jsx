import { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  Image, 
  Smile, 
  Send,
  Award,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Feed() {
  const { user } = useApp();
  const [postText, setPostText] = useState('');

  const [posts] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        role: 'Senior React Developer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      content: 'Just finished the Advanced React Patterns course! The section on Compound Components was a game changer for my design system work. highly recommend it! 🚀',
      type: 'achievement',
      achievement: {
        title: 'Advanced React Patterns',
        icon: Award,
        color: 'text-amber-500 bg-amber-50'
      },
      likes: 24,
      comments: 5,
      time: '2 hours ago'
    },
    {
      id: 2,
      author: {
        name: 'Alex Rivera',
        role: 'UX Designer',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      },
      content: 'Working on a new case study for the UX Professional Certificate. User research is fascinating - turns out most users prefer the "dark mode" by default in dev tools. Who knew? 🌙',
      type: 'text',
      likes: 45,
      comments: 12,
      time: '4 hours ago'
    },
    {
      id: 3,
      author: {
        name: 'PathFinder Team',
        role: 'Official',
        avatar: '/logo-small.png', // Fallback or placeholder
        isOfficial: true
      },
      content: 'We just added 5 new courses on AI and Machine Learning! content details inside 👇',
      type: 'announcement',
      attachment: {
        title: 'New AI Courses Available',
        description: 'Master the future with our new curriculum',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop'
      },
      likes: 156,
      comments: 23,
      time: '1 day ago'
    }
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Create Post */}
      <div className="card">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
             {/* Use first letter of user name as fallback if no avatar available in user object directly, 
                 though for now we'll just use a generic placeholder color/initial */}
             <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.[0] || 'U'}
             </div>
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your learning progress..."
              className="w-full bg-slate-50 border-none rounded-xl p-3 resize-none focus:ring-1 focus:ring-primary/20 outline-none text-sm min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <Image size={20} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <Smile size={20} />
                </button>
              </div>
              <button 
                className={`btn btn-primary btn-sm ${!postText.trim() && 'opacity-50 cursor-not-allowed'}`}
                disabled={!postText.trim()}
              >
                Post <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      {posts.map(post => (
        <div key={post.id} className="card">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                {post.author.avatar.startsWith('http') ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {post.author.name[0]}
                   </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{post.author.name}</h3>
                  {post.author.isOfficial && (
                    <span className="bg-blue-100 text-blue-600 p-0.5 rounded-full">
                      <CheckCircle size={12} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{post.author.role} • {post.time}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-slate-700 whitespace-pre-line mb-3">{post.content}</p>
            
            {/* Achievement Attachment */}
            {post.type === 'achievement' && (
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50`}>
                <div className={`p-2 rounded-lg ${post.achievement.color}`}>
                  <post.achievement.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Achievement Unlocked</p>
                  <p className="font-semibold text-slate-900">{post.achievement.title}</p>
                </div>
              </div>
            )}

            {/* Link/Image Attachment */}
            {post.attachment && (
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <img src={post.attachment.image} alt={post.attachment.title} className="w-full h-48 object-cover" />
                <div className="p-3 bg-slate-50">
                  <p className="font-semibold text-slate-900">{post.attachment.title}</p>
                  <p className="text-sm text-slate-500">{post.attachment.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium">
              <Heart size={18} />
              {post.likes}
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
              <MessageSquare size={18} />
              {post.comments}
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
