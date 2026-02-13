import React, { useEffect, useState } from "react";
import { fetchWithAuth, API_URL } from "../utils/api";

export default function Connections({ currentUserId, openChatWithUser }) {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data } = await fetchWithAuth(`${API_URL}/connections/connections`);
        setConnections(data || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching connections");
      }
    };
    fetchConnections();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Your Connections</h2>
      {connections.length === 0 ? (
        <p>No connections found.</p>
      ) : (
        <ul style={styles.list}>
          {connections.map((conn) => {
            const otherUser = [conn.requester, conn.recipient].find(
              (u) => u._id !== currentUserId
            );

            return (
              <li
                key={conn._id}
                style={styles.item}
                onClick={() => openChatWithUser(otherUser)}
              >
                <span>{otherUser.name}</span>
                {otherUser.headline && <small>{otherUser.headline}</small>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { margin: 20, width: 250, borderRight: "1px solid #ccc" },
  list: { listStyle: "none", padding: 0 },
  item: {
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
};
