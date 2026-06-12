import React from 'react';
import { Bot, User, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
                    <div style={{ lineHeight: 1.6 }}>
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p style={{ margin: "0.4rem 0" }}>{children}</p>,
                                strong: ({ children }) => <strong style={{ color: "#a5b4fc", fontWeight: 700 }}>{children}</strong>,
                                ul: ({ children }) => <ul style={{ paddingLeft: "1.2rem", margin: "0.4rem 0" }}>{children}</ul>,
                                ol: ({ children }) => <ol style={{ paddingLeft: "1.2rem", margin: "0.4rem 0" }}>{children}</ol>,
                                li: ({ children }) => <li style={{ margin: "0.2rem 0" }}>{children}</li>,
                                h1: ({ children }) => <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#a5b4fc", margin: "0.5rem 0" }}>{children}</h1>,
                                h2: ({ children }) => <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#a5b4fc", margin: "0.5rem 0" }}>{children}</h2>,
                                h3: ({ children }) => <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#a5b4fc", margin: "0.4rem 0" }}>{children}</h3>,
                                code: ({ children }) => <code style={{ background: "rgba(0,0,0,0.3)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.9em" }}>{children}</code>,
                                hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.5rem 0" }} />,
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
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