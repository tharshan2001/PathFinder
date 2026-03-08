import React, { useEffect, useState } from "react";
import { API_URL, fetchWithAuth } from "../utils/api";

export default function ChatList({ user, setSelectedChat }) {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { ok, data } = await fetchWithAuth(`${API_URL}/chat/chats/${user._id}`);
    if (ok) setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div style={{ width: 250, borderRight: "1px solid #ccc", overflowY: "auto" }}>
      <h3 style={{ padding: 10 }}>Inbox</h3>
      {chats.map(chat => {
        const other = chat.participants.find(p => p._id !== user._id);
        return (
          <div
            key={chat._id}
            style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}
            onClick={() => setSelectedChat(chat)}
          >
            <strong>{other.name}</strong>
            <div style={{ fontSize: 12, color: "#555" }}>{chat.lastMessage?.text || "No messages yet"}</div>
          </div>
        );
      })}
    </div>
  );
}