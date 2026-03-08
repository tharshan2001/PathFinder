import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchWithAuth, API_URL } from "../utils/api";

export default function Chat({ user }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);

  // Replace this with the ID of the user you want to chat with
  const OTHER_USER_ID = "69ad353db75ebed9e8362938";

  // ------------------- Initialize Socket -------------------
  useEffect(() => {
    const newSocket = io("http://localhost:5080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Connected to Socket.io:", newSocket.id));

    newSocket.on("newMessage", ({ message }) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, []);

  // ------------------- Create or get chat -------------------
  useEffect(() => {
    const initChat = async () => {
      if (!socket) return;

      const { data, ok } = await fetchWithAuth(`${API_URL}/chat/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: OTHER_USER_ID }),
      });

      if (ok && data?._id) {
        setChatId(data._id);
        loadMessages(data._id);
        socket.emit("joinRoom", data._id);
      }
    };

    initChat();
  }, [socket]);

  // ------------------- Load messages -------------------
  const loadMessages = async (chatId) => {
    const { data } = await fetchWithAuth(`${API_URL}/chat/messages/${chatId}`);
    // Ensure messages is an array
    setMessages(Array.isArray(data) ? data : data.messages || []);
  };

  // ------------------- Send message -------------------
  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;

    await fetchWithAuth(`${API_URL}/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, text }),
    });

    setText("");
    loadMessages(chatId); // reload after sending
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with User</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                alignSelf: msg.sender === user.id ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === user.id ? "#dcf8c6" : "#f1f0f0",
                padding: 8,
                borderRadius: 5,
                marginBottom: 5,
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>No messages yet</p>
        )}
      </div>

      <div style={{ marginTop: 10, display: "flex" }}>
        <input
          style={{ flex: 1, padding: 10, fontSize: 14 }}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          style={{ padding: "10px 20px", marginLeft: 5, cursor: "pointer" }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}