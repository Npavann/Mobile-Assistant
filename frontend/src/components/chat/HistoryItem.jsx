import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function HistoryItem({
    session,
    isActive,
    onSelect,
    onDelete,
    onRename,
    isCollapsed
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(session.title);

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
            className={`gpt-history-item ${isActive ? 'active' : ''}`}
            style={{ position: 'relative', justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '0.75rem 0' : '0.75rem' }}
            title={isCollapsed ? session.title : undefined}
        >
            <div className="gpt-title-wrap" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', flex: isCollapsed ? 'none' : 1 }}>
                <MessageSquare size={isCollapsed ? 20 : 16} color={isActive ? "white" : "var(--text-muted)"} style={{ flexShrink: 0 }} />

                {!isCollapsed && (
                    isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={e => e.stopPropagation()}>
                            <input
                                autoFocus
                                className="search-input"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleEditSubmit(e)}
                            />
                            <button onClick={handleEditSubmit} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }}><Check size={14} /></button>
                            <button onClick={() => { setIsEditing(false); setEditTitle(session.title); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                    ) : (
                        <span className="gpt-title-text" style={{ color: isActive ? "white" : "var(--text-muted)" }}>
                            {session.title}
                        </span>
                    )
                )}
            </div>

            {!isCollapsed && !isEditing && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Edit2
                        size={14}
                        color="var(--text-muted)"
                        style={{ cursor: "pointer", opacity: isActive ? 1 : 0.5 }}
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    />
                    <Trash2
                        size={14}
                        color="var(--error)"
                        style={{ cursor: "pointer", opacity: isActive ? 1 : 0.5 }}
                        onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                    />
                </div>
            )}
        </div>
    );
}
