import React from 'react';
import { Bot, User, Star } from 'lucide-react';

export default function ChatMessage({ msg, saveFavorite }) {
    return (
        <div className={`message ${msg.role === 'user' ? 'user' : ''}`} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', display: "flex", gap: "1rem", maxWidth: "85%", flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div className="avatar" style={{ flexShrink: 0 }}>
                {msg.role === "bot" ? <Bot size={20} color="white" /> : <User size={20} color="white" />}
            </div>

            <div className="bubble" style={{ position: "relative" }}>
                {msg.image && (
                    <div style={{ marginBottom: "0.75rem" }}>
                        <img 
                            src={msg.image} 
                            alt="Uploaded attachment" 
                            style={{ maxWidth: "240px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }} 
                        />
                    </div>
                )}
                
                {msg.content && (
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{msg.content}</div>
                )}

                {/* Single Phone Result */}
                {msg.phone && !msg.phones?.length && (
                    <Star
                        size={20}
                        onClick={() => saveFavorite(msg.phone)}
                        style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", color: "#fbbf24" }}
                    />
                )}

                {/* Comparison Result */}
                {msg.phones?.length > 0 && (
                    <div style={{ marginTop: "1rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        {msg.phones.map((p, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,0,0,0.2)", padding: "0.5rem 0.75rem", borderRadius: "8px", marginBottom: "0.5rem" }}>
                                <span style={{ fontWeight: 600, color: "#a5b4fc" }}>{p.model}</span>
                                <Star
                                    size={16}
                                    onClick={() => saveFavorite(p)}
                                    style={{ cursor: "pointer", color: "#fbbf24", marginLeft: "auto" }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
