import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import forumApi from '../services/forumApi';
import { MessageCircle, ThumbsUp, User, Plus, X } from 'lucide-react';

const Forums = () => {
  const { user } = useAuthStore();
  const [forums, setForums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [selectedForum, setSelectedForum] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchForums();
    fetchCategories();
  }, [selectedCategory]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const res = await forumApi.getForums(selectedCategory || undefined);
      setForums(res.data.forums || []);
    } catch (err) {
      console.error('Error fetching forums:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await forumApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      await forumApi.createForum(newPost);
      setNewPost({ title: '', content: '', category: 'General' });
      setShowForm(false);
      fetchForums();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleVote = async (forumId, vote) => {
    try {
      await forumApi.voteForum(forumId, vote);
      fetchForums();
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleViewForum = async (forum) => {
    try {
      const res = await forumApi.getForumById(forum._id);
      setSelectedForum(res.data);
    } catch (err) {
      console.error('Error fetching forum:', err);
    }
  };

  const handleAddReply = async () => {
    if (!replyContent) return;
    try {
      await forumApi.addReply(selectedForum._id, replyContent);
      setReplyContent('');
      const res = await forumApi.getForumById(selectedForum._id);
      setSelectedForum(res.data);
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const defaultCategories = ['Web Development', 'Data Science', 'Cloud Computing', 'Career Advice', 'General'];
  const allCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discussion Forums</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
          >
            <Plus size={18} /> New Post
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === '' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Create Post Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create New Post</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg mb-3"
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg mb-3"
                rows={4}
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg mb-4"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={handleCreatePost}
                className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Forum Detail Modal */}
        {selectedForum && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{selectedForum.title}</h2>
                <button onClick={() => setSelectedForum(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              {/* Original Post */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedForum.userId?.name || 'Unknown'}</p>
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{selectedForum.category}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{selectedForum.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button 
                    onClick={() => handleVote(selectedForum._id, 'up')}
                    className="flex items-center gap-1 hover:text-teal-600"
                  >
                    <ThumbsUp size={16} /> {selectedForum.upvotes?.length || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> {selectedForum.replies?.length || 0} replies
                  </span>
                  <span>{selectedForum.views} views</span>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-4">
                {selectedForum.replies?.map((reply, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="font-medium text-sm">{reply.userId?.name || 'Unknown'}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Reply */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={handleAddReply}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forums List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : forums.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No discussions yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forums.map((forum) => (
              <div 
                key={forum._id} 
                onClick={() => handleViewForum(forum)}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{forum.userId?.name || 'Unknown'}</p>
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{forum.category}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{forum.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{forum.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleVote(forum._id, 'up') }}
                    className="flex items-center gap-1 hover:text-teal-600"
                  >
                    <ThumbsUp size={16} /> {forum.upvotes?.length || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> {forum.replies?.length || 0} replies
                  </span>
                  <span>{forum.views} views</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Forums;
