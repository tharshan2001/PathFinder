import Forum from "../../models/forum/Forum.js";

// Get all forums
export const getForums = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    
    const forums = await Forum.find(query)
      .populate("userId", "name profileMedia")
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Forum.countDocuments(query);
    
    res.json({
      forums,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get forum by ID
export const getForumById = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findById(id)
      .populate("userId", "name profileMedia headline")
      .populate("replies.userId", "name profileMedia");
    
    if (!forum) return res.status(404).json({ message: "Forum not found" });
    
    // Increment views
    forum.views += 1;
    await forum.save();
    
    res.json(forum);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create forum post
export const createForum = async (req, res) => {
  try {
    const forumData = {
      ...req.body,
      userId: req.user.id
    };
    const forum = new Forum(forumData);
    await forum.save();
    await forum.populate("userId", "name profileMedia");
    res.status(201).json({ message: "Forum created", forum });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update forum post
export const updateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!forum) return res.status(404).json({ message: "Forum not found or unauthorized" });
    res.json({ message: "Forum updated", forum });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete forum post
export const deleteForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!forum) return res.status(404).json({ message: "Forum not found or unauthorized" });
    res.json({ message: "Forum deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add reply to forum
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const forum = await Forum.findById(id);
    if (!forum) return res.status(404).json({ message: "Forum not found" });
    if (forum.isLocked) return res.status(403).json({ message: "Forum is locked" });
    
    forum.replies.push({
      userId: req.user.id,
      content
    });
    await forum.save();
    await forum.populate("replies.userId", "name profileMedia");
    
    res.json({ message: "Reply added", forum });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upvote/Downvote forum
export const voteForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'
    
    const forum = await Forum.findById(id);
    if (!forum) return res.status(404).json({ message: "Forum not found" });
    
    const userId = req.user.id;
    const upIndex = forum.upvotes.indexOf(userId);
    const downIndex = forum.downvotes.indexOf(userId);
    
    // Remove existing votes
    if (upIndex > -1) forum.upvotes.splice(upIndex, 1);
    if (downIndex > -1) forum.downvotes.splice(downIndex, 1);
    
    // Add new vote
    if (vote === "up" && upIndex === -1) {
      forum.upvotes.push(userId);
    } else if (vote === "down" && downIndex === -1) {
      forum.downvotes.push(userId);
    }
    
    await forum.save();
    res.json({ 
      message: "Vote recorded", 
      upvotes: forum.upvotes.length, 
      downvotes: forum.downvotes.length 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Forum.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
