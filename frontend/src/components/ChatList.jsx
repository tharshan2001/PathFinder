import React from "react";

export default function ChatList({ inbox, setCurrentChat, currentChat, currentUserId }) {
  return (
    <div style={styles.list}>
      <h3>Chats</h3>
      {inbox.map((chat) => {
        const otherUser = chat.participants.find((p) => p._id !== currentUserId);
        return (
          <div
            key={chat._id}
            style={{
              ...styles.chatItem,
              backgroundColor: currentChat?._id === chat._id ? "#ddd" : "#fff",
            }}
            onClick={() => setCurrentChat(chat)}
          >
            {otherUser?.name || "Unknown"}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  list: { width: 250, borderRight: "1px solid #ccc", padding: 10 },
  chatItem: { padding: 10, cursor: "pointer", marginBottom: 5 },
};
