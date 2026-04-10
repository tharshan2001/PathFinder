import Chat from "../../models/message/Chat.js";
import Message from "../../models/message/Message.js";
import User from "../../models/user/User.js";
import { Server } from "socket.io";
import { notifyMessage } from "../../services/notificationService.js";

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: true, methods: ["GET", "POST"], credentials: true }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      
      io.emit("userOnline", { userId });
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} joined their room.`);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("userOffline", { userId: socket.userId });
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};



// -------------------- Chat/Message Controllers --------------------

export const createOrGetChat = async (req, res) => {
  let { receiverId } = req.body;
  let senderId = req.user.id;

  // Convert to strings and handle objects
  if (typeof receiverId === 'object' && receiverId !== null) {
    receiverId = String(receiverId._id || receiverId.id || receiverId);
  }
  senderId = String(senderId);

  // Remove any non-ObjectId characters
  receiverId = receiverId.replace(/[^0-9a-f]/gi, '');
  senderId = senderId.replace(/[^0-9a-f]/gi, '');

  console.log('Creating chat - sender:', senderId, 'receiver:', receiverId);

  if (!receiverId || receiverId.length !== 24) {
    return res.status(400).json({ message: "Invalid Receiver ID" });
  }

  try {
    // Find existing chat
    let chat = await Chat.findOne({
      $or: [
        { participants: [senderId, receiverId] },
        { participants: [receiverId, senderId] }
      ]
    });

    if (chat) {
      console.log('Found existing chat:', chat._id);
      return res.status(200).json(chat);
    }

    // Try to create new chat
    chat = await Chat.create({ participants: [senderId, receiverId] });
    console.log('Created new chat:', chat._id);
    return res.status(200).json(chat);

  } catch (createError) {
    console.log('Create error:', createError.message);
    if (createError.code === 11000) {
      // Chat exists, find it
      const chat = await Chat.findOne({
        $or: [
          { participants: [senderId, receiverId] },
          { participants: [receiverId, senderId] }
        ]
      });
      console.log('Found chat after duplicate:', chat?._id);
      if (chat) {
        return res.status(200).json(chat);
      }
    }
    console.error('Chat error:', createError);
    res.status(500).json({ message: "Error creating or fetching chat", error: createError.message });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user.id;

  try {
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
      readBy: [senderId]
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage: message._id },
      { new: true }
    )
      .populate("participants", "name profileMedia")
      .populate("lastMessage");

    // Emit message to sender and receiver
    const receiver = updatedChat.participants.find(
      (participant) => participant._id.toString() !== senderId
    );

    io.to(senderId).emit("newMessage", { chat: updatedChat, message });
    if (receiver) {
      io.to(receiver._id.toString()).emit("newMessage", { chat: updatedChat, message });
      const sender = await User.findById(senderId).select("name profileMedia");
      await notifyMessage(sender, receiver);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

export const getInbox = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name profileMedia")
      .populate({ path: "lastMessage", select: "text createdAt" })
      .sort({ "lastMessage.createdAt": -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};
