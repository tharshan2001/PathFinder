import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { fetchWithAuth, API_URL } from "./utils/api";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, ok } = await fetchWithAuth(`${API_URL}/auth/me`);
      if (ok) setUser(data.user);
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Login setUser={setUser} />} />
        <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
