import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import ConnectionsList from "./components/ConnectionsList";
import ChatWindow from "./components/ChatWindow";
import { fetchWithAuth, API_URL } from "./utils/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Persist login ----------------
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { ok, data } = await fetchWithAuth(`${API_URL}/auth/me`);
        if (ok && data.user) setUser(data.user);
      } catch (err) {
        console.error("Error checking login:", err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ConnectionsList user={user} onSelectConnection={setSelectedConnection} />
      {selectedConnection ? (
        <ChatWindow user={user} receiver={selectedConnection} />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>Select a connection to start chat</h3>
        </div>
      )}
    </div>
  );
}