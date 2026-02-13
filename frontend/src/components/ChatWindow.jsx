import React, { useEffect, useState } from "react";
import { fetchWithAuth, API_URL } from "../utils/api";

export default function ChatWindow({ chat, messages, socket, user, loadMessages }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (chat?._id) loadMessages(chat._id);
  }, [chat]);

  const sendMessage = async () => {
    if (!text.trim() || !chat?._id) return;

    await fetchWithAuth(`${API_URL}/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: chat._id, text }),
    });

    setText("");
  };

  return (
    <div style={styles.window}>
      <h3>Chat</h3>
      <div style={styles.messages}>
        {(messages || []).map((msg) => (
          <div
            key={msg._id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === user.id ? "flex-end" : "flex-start",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  window: { flex: 1, display: "flex", flexDirection: "column", padding: 10 },
  messages: { flex: 1, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column" },
  message: { padding: 8, margin: 5, borderRadius: 5, backgroundColor: "#eee", maxWidth: 300 },
  inputContainer: { display: "flex" },
  input: { flex: 1, padding: 10, fontSize: 14 },
  button: { padding: 10, cursor: "pointer" },
};
