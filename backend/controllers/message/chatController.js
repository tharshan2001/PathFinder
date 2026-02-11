import Chat from "../../models/message/Chat.js";
import Message from "../../models/message/Message.js";
import { Server } from "socket.io";

// Initialize Socket.IO instance
let io;
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room.`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Create or get a chat between two users
export const createOrGetChat = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });

    if (!chat) {
      chat = await Chat.create({ participants: [senderId, receiverId] });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error creating or fetching chat", error: error.message });
  }
};

// Update sendMessage to include Socket.IO
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
    ).populate("participants", "name profileMedia").populate("lastMessage");

    // Emit the message to both sender and receiver rooms
    const receiverId = updatedChat.participants.find(
      (participant) => participant.id !== senderId
    );

    io.to(senderId).emit("newMessage", { chat: updatedChat, message });
    io.to(receiverId).emit("newMessage", { chat: updatedChat, message });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// Fetch inbox/chat list
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

// Fetch messages for a specific chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};