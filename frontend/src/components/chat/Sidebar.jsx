import { useState } from 'react';
import { Edit, Search, Trash2, X, Plus } from 'lucide-react';
import HistoryItem from './HistoryItem';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({
    chatHistory, currentChatId, createNewChat, switchChat,
    deleteChat, renameChat, clearAllHistory, isOpen, setIsOpen
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredHistory = chatHistory.filter(chat => {
        const titleMatch = chat.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const msgMatch = chat.messages?.some(m => m.content?.toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || msgMatch;
    });

    return (
        <div style={{
            position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50,
            width: "280px",
            background: "#171717",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column",
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
            padding: "1rem"
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>MobileAssist AI</span>
                <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "0.25rem" }}>
                    <X size={20} />
                </button>
            </div>

            {/* New Chat Button */}
            <button onClick={() => { createNewChat(); setIsOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", cursor: "pointer", marginBottom: "1rem", fontWeight: 500, fontSize: "0.9rem" }}>
                <Plus size={18} /> New Chat
            </button>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                />
            </div>

            {/* Navigation Links */}
            <div style={{ marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "1rem" }}>
                <button onClick={() => { navigate('/favorites'); setIsOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.65rem 0.75rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", borderRadius: "8px", fontSize: "0.9rem" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    ⭐ Favorite Phones
                </button>
                <button onClick={() => { navigate('/admin-login'); setIsOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.65rem 0.75rem", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", borderRadius: "8px", fontSize: "0.9rem" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    🗄️ Database Admin
                </button>
            </div>

            {/* Chat History */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent</p>
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(session => (
                        <HistoryItem
                            key={session.id}
                            session={session}
                            isActive={session.id === currentChatId}
                            onSelect={(id) => { switchChat(id); setIsOpen(false); }}
                            onDelete={deleteChat}
                            onRename={renameChat}
                            isCollapsed={false}
                        />
                    ))
                ) : (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>
                        {searchTerm ? "No matching chats" : "No chats yet"}
                    </p>
                )}
            </div>

            {/* Clear History */}
            {chatHistory.length > 0 && (
                <button onClick={() => { if (window.confirm("Delete all chat history?")) clearAllHistory(); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.75rem", background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", cursor: "pointer", marginTop: "1rem", fontSize: "0.85rem" }}>
                    <Trash2 size={15} /> Clear History
                </button>
            )}
        </div>
    );
}