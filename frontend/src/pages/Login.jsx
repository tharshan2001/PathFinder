import React, { useState } from "react";
import { API_URL, fetchWithAuth } from "../utils/api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { ok, data } = await fetchWithAuth(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    if (ok) setUser(data.user);
    else alert(data.message || "Login failed");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ margin: 10, padding: 10, width: 250 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ margin: 10, padding: 10, width: 250 }} />
      <button onClick={login} style={{ padding: 10, width: 150, cursor: "pointer" }}>Login</button>
    </div>
  );
}
