import { useState, useEffect } from "react";

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatSessions")) || [];
    setSessions(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("chatSessions");
    localStorage.removeItem("currentChatId");
    setSessions([]);
  };

  return (
    <div className="page">
      <h1 className="page-title">Chat History</h1>

      <button
        onClick={clearHistory}
        style={{
          marginBottom: "15px",
          padding: "8px 12px",
          background: "#ff4d4d",
          border: "none",
          borderRadius: "6px",
          color: "white",
          cursor: "pointer"
        }}
      >
        Clear All Chats
      </button>

      {sessions.length === 0 ? (
        <p>No chats available</p>
      ) : (
        sessions.map(chat => (
          <div
            key={chat.id}
            onClick={() => {
              localStorage.setItem("currentChatId", chat.id);
              window.location.href = "/";
            }}
            style={{
              marginBottom: "10px",
              padding: "12px",
              background: "#1e1e2f",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <strong>{chat.title}</strong>
            <p style={{ fontSize: "12px", color: "#aaa" }}>
              {chat.messages.length} messages
            </p>
          </div>
        ))
      )}
    </div>
  );
}