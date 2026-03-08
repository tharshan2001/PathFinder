import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { API_URL, fetchWithAuth } from "../utils/api";

export default function ChatWindow({ user, receiver }) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const chatBoxRef = useRef();

  // ---------------- Initialize chat ----------------
  useEffect(() => {
    if (!receiver) return;

    const initChat = async () => {
      const { data } = await fetchWithAuth(`${API_URL}/chat/chats`, {
        method: "POST",
        body: JSON.stringify({ receiverId: receiver._id }),
      });
      setChat(data);
    };

    initChat();
  }, [receiver]);

  // ---------------- Fetch messages ----------------
  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      const { ok, data } = await fetchWithAuth(`${API_URL}/chat/messages/${chat._id}`);
      if (ok) setMessages(data);
    };

    fetchMessages();
  }, [chat]);

  // ---------------- Socket.IO ----------------
  useEffect(() => {
    socketRef.current = io("http://localhost:5080", { withCredentials: true });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", user._id.toString());
    });

    socketRef.current.on("newMessage", ({ message }) => {
      if (!chat) return;

      const messageChatId = message.chat?._id || message.chat;
      if (messageChatId.toString() === chat._id.toString()) {
        if (!message.sender?.name) {
          message.sender = {
            _id: message.sender,
            name: message.sender === user._id ? "You" : receiver.name || "Contact",
          };
        }
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [chat, user._id, receiver.name]);

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // ---------------- Send message ----------------
  const sendMessage = async () => {
    if (!input.trim() || !chat) return;

    const { ok, data } = await fetchWithAuth(`${API_URL}/chat/messages`, {
      method: "POST",
      body: JSON.stringify({ chatId: chat._id, text: input }),
    });

    if (ok) {
      const msg = data;
      if (!msg.sender?._id) msg.sender = { _id: user._id, name: "You" };
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  // ---------------- Styles ----------------
  const styles = {
    container: { flex: 1, display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#fff" },
    header: { padding: "12px 16px", borderBottom: "1px solid #efefef", display: "flex", alignItems: "center", gap: "12px" },
    avatar: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#0084ff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" },
    chatArea: { flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column" },
    bubble: (isMe) => ({
      maxWidth: "70%",
      padding: "10px 14px",
      borderRadius: "18px",
      fontSize: "15px",
      lineHeight: "1.4",
      marginBottom: "6px",
      alignSelf: isMe ? "flex-end" : "flex-start",
      backgroundColor: isMe ? "#0084ff" : "#e4e6eb",
      color: isMe ? "white" : "black",
      borderBottomRightRadius: isMe ? "4px" : "18px",
      borderBottomLeftRadius: isMe ? "18px" : "4px",
    }),
    senderName: { fontSize: "12px", fontWeight: 500, marginBottom: "2px", color: "#555" },
    inputArea: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid #efefef" },
    textInput: { flex: 1, backgroundColor: "#f0f2f5", border: "none", borderRadius: "20px", padding: "10px 16px", outline: "none", fontSize: "15px" },
    sendBtn: { background: "none", border: "none", color: "#0084ff", fontWeight: "700", cursor: "pointer", padding: "5px", opacity: !input.trim() ? 0.5 : 1 },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>{receiver?.name?.charAt(0).toUpperCase() || "U"}</div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "16px" }}>{receiver?.name}</div>
          <div style={{ fontSize: "12px", color: "#65676b" }}>Active now</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatBoxRef} style={styles.chatArea}>
        {messages.map((msg, index) => {
          const isMe = (msg.sender?._id || msg.sender) === user._id;
          return (
            <div key={msg._id || index} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
              {!isMe && <div style={styles.senderName}>{msg.sender?.name}</div>}
              <div style={styles.bubble(isMe)}>{msg.text}</div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          style={styles.textInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Aa"
          disabled={!chat}
        />
        <button onClick={sendMessage} style={styles.sendBtn} disabled={!chat || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}