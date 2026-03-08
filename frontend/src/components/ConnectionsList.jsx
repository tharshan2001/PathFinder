import React, { useEffect, useState } from "react";
import { API_URL, fetchWithAuth } from "../utils/api";

export default function ConnectionsList({ user, onSelectConnection }) {
  const [connections, setConnections] = useState([]);

  const fetchConnections = async () => {
    const { ok, data } = await fetchWithAuth(`${API_URL}/connections/connections`);
    if (ok) {
      const accepted = data.filter(c => c.status === "accepted");
      setConnections(accepted);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const getOtherUser = (connection) =>
    connection.requester._id === user._id ? connection.recipient : connection.requester;

  return (
    <div style={{ width: 250, borderRight: "1px solid #ccc", overflowY: "auto" }}>
      <h3 style={{ padding: 10 }}>Connections</h3>
      {connections.length === 0 && <div style={{ padding: 10 }}>No connections yet</div>}
      {connections.map((conn) => {
        const other = getOtherUser(conn);
        return (
          <div
            key={conn._id}
            style={{
              padding: 10,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => onSelectConnection(other)}
          >
            <strong>{other.name}</strong>
            <div style={{ fontSize: 12, color: "#555" }}>{other.headline || "No headline"}</div>
          </div>
        );
      })}
    </div>
  );
}