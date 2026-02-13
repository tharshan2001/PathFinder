import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Connections from "../components/Connections";
import ChatWindow from "../components/ChatWindow";
import ChatList from "../components/ChatList";
import { fetchWithAuth, API_URL } from "../utils/api";

export default function Chat({ user }) {
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inbox, setInbox] = useState([]);

  // Load inbox
  const loadInbox = async () => {
    const { data } = await fetchWithAuth(`${API_URL}/chat/chats/${user.id}`);
    setInbox(data || []);
  };

  const loadMessages = async (chatId) => {
    if (!chatId) return;
    const { data } = await fetchWithAuth(`${API_URL}/chat/messages/${chatId}`);
    setMessages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5080", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => newSocket.emit("joinRoom", user.id));

    newSocket.on("newMessage", ({ chat, message }) => {
      if (currentChat?._id === chat._id) setMessages((prev) => [...prev, message]);
      setInbox((prevInbox) =>
        prevInbox.map((c) => (c._id === chat._id ? { ...c, lastMessage: message } : c))
      );
    });

    loadInbox();
    return () => newSocket.disconnect();
  }, []);

  // Open chat with a user
  const openChatWithUser = async (otherUser) => {
    if (!otherUser?._id) return;
    const { data: chat } = await fetchWithAuth(`${API_URL}/chat/chat-with/${otherUser._id}`);
    if (!chat?._id) return;
    setCurrentChat(chat);
    loadMessages(chat._id);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Connections currentUserId={user.id} openChatWithUser={openChatWithUser} />
      <ChatList inbox={inbox} setCurrentChat={setCurrentChat} currentChat={currentChat} currentUserId={user.id} />
      {currentChat && (
        <ChatWindow chat={currentChat} messages={messages} socket={socket} user={user} loadMessages={loadMessages} />
      )}
    </div>
  );
}
