import { useState } from 'react';
import { Search, Trash2, X, Plus, Star, Database, MessageSquare, Upload } from 'lucide-react';
import HistoryItem from './HistoryItem';
import { useNavigate } from 'react-router-dom';

// Same dark navy/indigo theme as Chat.jsx, UserLogin.jsx, AdminLogin.jsx, AppLock.jsx
const COLORS = {
    sidebarBg: "#151329",
    border: "rgba(255, 255, 255, 0.1)",
    logoGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    titleText: "#FFFFFF",
    closeBtnBg: "rgba(255,255,255,0.07)",
    closeBtnIcon: "#B0ADD1",
    newChatBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    newChatText: "#FFFFFF",
    searchBg: "rgba(255,255,255,0.06)",
    searchBorder: "rgba(255,255,255,0.14)",
    searchText: "#F5F4FC",
    searchIcon: "#9C99C2",
    navText: "#E4E2F5",
    navHoverBg: "rgba(255,255,255,0.06)",
    sectionLabel: "#8582AC",
    emptyText: "#8582AC",
    clearBg: "rgba(239,68,68,0.12)",
    clearBorder: "rgba(239,68,68,0.35)",
    clearText: "#FCA5A5",
    star: { bg: "rgba(245,197,66,0.15)", icon: "#F5C542" },
    upload: { bg: "rgba(52,211,153,0.15)", icon: "#34D399" },
    admin: { bg: "rgba(129,140,248,0.15)", icon: "#A5B4FC" },
};

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
            background: COLORS.sidebarBg,
            borderRight: `1px solid ${COLORS.border}`,
            display: "flex", flexDirection: "column",
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            padding: "1.25rem"
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: "28px", height: "28px", background: COLORS.logoGradient, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MessageSquare size={14} color="white" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: COLORS.titleText }}>MobileAssist AI</span>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: COLORS.closeBtnBg, border: "none", color: COLORS.closeBtnIcon, cursor: "pointer", padding: "0.4rem", borderRadius: "8px", display: "flex" }}>
                    <X size={16} />
                </button>
            </div>

            {/* New Chat Button */}
            <button onClick={() => { createNewChat(); setIsOpen(false); }}
                style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    width: "100%", padding: "0.8rem 1rem",
                    background: COLORS.newChatBg,
                    border: "none", borderRadius: "12px",
                    color: COLORS.newChatText, cursor: "pointer",
                    marginBottom: "1.25rem", fontWeight: 600,
                    fontSize: "0.9rem", boxShadow: "0 4px 15px rgba(91,63,203,0.4)",
                    transition: "opacity 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
                <Plus size={18} /> New Chat
            </button>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: COLORS.searchIcon }} />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", background: COLORS.searchBg, border: `1.5px solid ${COLORS.searchBorder}`, borderRadius: "10px", color: COLORS.searchText, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                />
            </div>

            {/* Navigation Links */}
            <div style={{ marginBottom: "1rem", borderBottom: `1.5px solid ${COLORS.border}`, paddingBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <button onClick={() => { navigate('/favorites'); setIsOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.7rem 0.75rem", background: "none", border: "none", color: COLORS.navText, cursor: "pointer", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500, transition: "background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.navHoverBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                    <div style={{ width: "30px", height: "30px", background: COLORS.star.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Star size={15} color={COLORS.star.icon} />
                    </div>
                    Favorite Phones
                </button>

                <button onClick={() => { navigate('/user-login'); setIsOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.7rem 0.75rem", background: "none", border: "none", color: COLORS.navText, cursor: "pointer", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500, transition: "background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.navHoverBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                    <div style={{ width: "30px", height: "30px", background: COLORS.upload.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Upload size={15} color={COLORS.upload.icon} />
                    </div>
                    Upload Data (User)
                </button>

                <button onClick={() => { navigate('/admin-login'); setIsOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.7rem 0.75rem", background: "none", border: "none", color: COLORS.navText, cursor: "pointer", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500, transition: "background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.navHoverBg; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                    <div style={{ width: "30px", height: "30px", background: COLORS.admin.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Database size={15} color={COLORS.admin.icon} />
                    </div>
                    Database Admin
                </button>
            </div>

            {/* Chat History */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <p style={{ fontSize: "0.7rem", color: COLORS.sectionLabel, marginBottom: "0.5rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Chats</p>
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
                    <p style={{ color: COLORS.emptyText, fontSize: "0.85rem", textAlign: "center", marginTop: "2rem" }}>
                        {searchTerm ? "No matching chats" : "Start a new chat!"}
                    </p>
                )}
            </div>

            {/* Clear History */}
            {chatHistory.length > 0 && (
                <button onClick={() => { if (window.confirm("Delete all chat history?")) clearAllHistory(); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.7rem", background: COLORS.clearBg, color: COLORS.clearText, border: `1.5px solid ${COLORS.clearBorder}`, borderRadius: "10px", cursor: "pointer", marginTop: "1rem", fontSize: "0.85rem", fontWeight: 500 }}>
                    <Trash2 size={14} /> Clear History
                </button>
            )}
        </div>
    );
}
