import { useState } from 'react';
import { Edit, Search, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import HistoryItem from './HistoryItem';

export default function Sidebar({
    chatHistory,
    currentChatId,
    createNewChat,
    switchChat,
    deleteChat,
    renameChat,
    clearAllHistory,
    isOpen,
    setIsOpen
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredHistory = chatHistory.filter(chat => {
        const titleMatch = chat.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const msgMatch = chat.messages?.some(m => m.content?.toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || msgMatch;
    });

    return (
        <div className={`gpt-sidebar ${!isOpen ? 'collapsed' : ''}`}>

            {/* Top Controller Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', marginBottom: '1.5rem', width: '100%' }}>
                <button onClick={() => setIsOpen(!isOpen)} className="icon-btn" title="Toggle Sidebar">
                    {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
                {isOpen ? (
                    <button onClick={createNewChat} className="icon-btn" title="New Chat">
                        <Edit size={18} />
                    </button>
                ) : null}
            </div>

            {isOpen ? (
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <div style={{ position: "absolute", left: "10px", top: "12px", pointerEvents: "none" }}>
                        <Search size={16} color="var(--text-muted)" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} className="icon-btn" style={{ marginBottom: '1rem' }} title="Search Chats">
                    <Search size={20} />
                </button>
            )}

            {/* New chat collapsed button */}
            {!isOpen && (
                <button onClick={createNewChat} className="icon-btn" style={{ marginBottom: '1rem' }} title="New Chat">
                    <Edit size={20} />
                </button>
            )}

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem", width: '100%' }} className="custom-scrollbar">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(session => (
                        <HistoryItem
                            key={session.id}
                            session={session}
                            isActive={session.id === currentChatId}
                            onSelect={switchChat}
                            onDelete={deleteChat}
                            onRename={renameChat}
                            isCollapsed={!isOpen}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginTop: isOpen ? "2rem" : "0.5rem" }}>
                        {isOpen ? (searchTerm ? "No matching chats" : "No chats yet") : "-"}
                    </div>
                )}
            </div>

            {chatHistory.length > 0 && isOpen && (
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to delete all chat history?")) {
                            clearAllHistory();
                        }
                    }}
                    style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "var(--error)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    <Trash2 size={16} />
                    Clear History
                </button>
            )}
        </div>
    );
}
