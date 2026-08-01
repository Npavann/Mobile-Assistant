import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

// Same dark navy/indigo theme as Sidebar.jsx
const COLORS = {
    activeBg: "rgba(99,102,241,0.18)",
    activeBorder: "rgba(99,102,241,0.4)",
    hoverBg: "rgba(255,255,255,0.06)",
    iconBoxBg: "rgba(255,255,255,0.07)",
    iconBoxBgActive: "rgba(99,102,241,0.3)",
    iconColor: "#8582AC",
    iconColorActive: "#A5B4FC",
    titleText: "#E4E2F5",
    titleTextActive: "#FFFFFF",
    editInputBg: "rgba(255,255,255,0.08)",
    editInputBorder: "rgba(99,102,241,0.5)",
    editInputText: "#F5F4FC",
    confirmBg: "rgba(16,185,129,0.18)",
    confirmIcon: "#34D399",
    cancelBg: "rgba(239,68,68,0.18)",
    cancelIcon: "#F87171",
    actionBtnBg: "rgba(255,255,255,0.06)",
    actionBtnIcon: "#9C99C2",
    actionBtnHoverBg: "rgba(255,255,255,0.14)",
    actionBtnHoverIcon: "#FFFFFF",
    deleteBtnBg: "rgba(239,68,68,0.1)",
    deleteBtnIcon: "rgba(248,113,113,0.7)",
    deleteBtnHoverBg: "rgba(239,68,68,0.22)",
    deleteBtnHoverIcon: "#F87171",
};

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
                    ? COLORS.activeBg
                    : isHovered ? COLORS.hoverBg : "transparent",
                border: isActive
                    ? `1px solid ${COLORS.activeBorder}`
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
                    background: isActive ? COLORS.iconBoxBgActive : COLORS.iconBoxBg,
                    borderRadius: "7px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <MessageSquare size={13} color={isActive ? COLORS.iconColorActive : COLORS.iconColor} />
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
                                    flex: 1, background: COLORS.editInputBg,
                                    border: `1px solid ${COLORS.editInputBorder}`,
                                    borderRadius: "6px", color: COLORS.editInputText,
                                    padding: "3px 8px", fontSize: "0.8rem", outline: "none"
                                }}
                            />
                            <button onClick={handleEditSubmit}
                                style={{ background: COLORS.confirmBg, border: "none", color: COLORS.confirmIcon, cursor: "pointer", borderRadius: "5px", padding: "3px 6px", display: "flex" }}>
                                <Check size={12} />
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditTitle(session.title); }}
                                style={{ background: COLORS.cancelBg, border: "none", color: COLORS.cancelIcon, cursor: "pointer", borderRadius: "5px", padding: "3px 6px", display: "flex" }}>
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <span style={{
                            fontSize: "0.85rem",
                            fontWeight: isActive ? 500 : 400,
                            color: isActive ? COLORS.titleTextActive : COLORS.titleText,
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
                            background: COLORS.actionBtnBg, border: "none",
                            color: COLORS.actionBtnIcon, cursor: "pointer",
                            borderRadius: "6px", padding: "4px", display: "flex",
                            transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = COLORS.actionBtnHoverBg; e.currentTarget.style.color = COLORS.actionBtnHoverIcon; }}
                        onMouseLeave={e => { e.currentTarget.style.background = COLORS.actionBtnBg; e.currentTarget.style.color = COLORS.actionBtnIcon; }}
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                        style={{
                            background: COLORS.deleteBtnBg, border: "none",
                            color: COLORS.deleteBtnIcon, cursor: "pointer",
                            borderRadius: "6px", padding: "4px", display: "flex",
                            transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = COLORS.deleteBtnHoverBg; e.currentTarget.style.color = COLORS.deleteBtnHoverIcon; }}
                        onMouseLeave={e => { e.currentTarget.style.background = COLORS.deleteBtnBg; e.currentTarget.style.color = COLORS.deleteBtnIcon; }}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
