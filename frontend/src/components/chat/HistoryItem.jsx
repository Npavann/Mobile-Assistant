import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function HistoryItem({
    session, isActive, onSelect, onDelete, onRename, isCollapsed
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(session.title);
    const [isHovered, setIsHovered] = useState(false);

    const handleEditSubmit = (e) => {
        e.stopPropagation();
        if (editTitle.trim()) {
            onRename(session.id, editTitle);
        } else {
            setEditTitle(session.title);
        }
        setIsEditing(false);
    };

    return (
        <div
            onClick={() => !isEditing && onSelect(session.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                cursor: "pointer",
                background: isActive
                    ? "rgba(99,102,241,0.15)"
                    : isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                border: isActive
                    ? "1px solid rgba(99,102,241,0.25)"
                    : "1px solid transparent",
                transition: "all 0.15s ease",
                marginBottom: "2px",
                position: "relative"
            }}
        >
            {/* Left side - icon + title */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0 }}>
                <div style={{
                    width: "28px", height: "28px", flexShrink: 0,
                    background: isActive ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                    borderRadius: "7px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <MessageSquare size={13} color={isActive ? "#818cf8" : "rgba(255,255,255,0.35)"} />
                </div>

                {!isCollapsed && (
                    isEditing ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}
                            onClick={e => e.stopPropagation()}>
                            <input
                                autoFocus
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleEditSubmit(e)}
                                style={{
                                    flex: 1, background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(99,102,241,0.4)",
                                    borderRadius: "6px", color: "white",
                                    padding: "3px 8px", fontSize: "0.8rem", outline: "none"
                                }}
                            />
                            <button onClick={handleEditSubmit}
                                style={{ background: "rgba(16,185,129,0.15)", border: "none", color: "#10b981", cursor: "pointer", borderRadius: "5px", padding: "3px 6px", display: "flex" }}>
                                <Check size={12} />
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditTitle(session.title); }}
                                style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#ef4444", cursor: "pointer", borderRadius: "5px", padding: "3px 6px", display: "flex" }}>
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <span style={{
                            fontSize: "0.85rem",
                            fontWeight: isActive ? 500 : 400,
                            color: isActive ? "white" : "rgba(255,255,255,0.55)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            flex: 1
                        }}>
                            {session.title}
                        </span>
                    )
                )}
            </div>

            {/* Right side - action buttons (show on hover or active) */}
            {!isCollapsed && !isEditing && (isHovered || isActive) && (
                <div style={{ display: "flex", gap: "4px", flexShrink: 0, marginLeft: "0.5rem" }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        style={{
                            background: "rgba(255,255,255,0.06)", border: "none",
                            color: "rgba(255,255,255,0.4)", cursor: "pointer",
                            borderRadius: "6px", padding: "4px", display: "flex",
                            transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                        style={{
                            background: "rgba(239,68,68,0.08)", border: "none",
                            color: "rgba(239,68,68,0.5)", cursor: "pointer",
                            borderRadius: "6px", padding: "4px", display: "flex",
                            transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "rgba(239,68,68,0.5)"; }}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}