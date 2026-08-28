import React, { useState, useEffect } from 'react';
import { X, Trash2, Star, MessageSquareText } from 'lucide-react';

export default function FavoritesModal({ isOpen, onClose }) {
    const [favorites, setFavorites] = useState([]);
    const [aiFavorites, setAiFavorites] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const savedAiFavorites = JSON.parse(localStorage.getItem("aiFavorites")) || [];
            setFavorites(savedFavorites);
            setAiFavorites(savedAiFavorites);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const removeFavorite = (phone) => {
        const updatedFavorites = favorites.filter(
            p => p.model !== phone.model
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const removeAiFavorite = (savedAt) => {
        const updated = aiFavorites.filter(f => f.savedAt !== savedAt);
        setAiFavorites(updated);
        localStorage.setItem("aiFavorites", JSON.stringify(updated));
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                background: 'var(--bg-card)',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                        <Star size={20} color="#fbbf24" />
                        Saved Items
                    </h2>
                    <button onClick={onClose} className="icon-btn" style={{ padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="custom-scrollbar" style={{
                    padding: '1.25rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {favorites.length === 0 && aiFavorites.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                            Nothing saved yet.
                        </div>
                    ) : (
                        <>
                            {/* Favorite Phones */}
                            {favorites.length > 0 && (
                                <div style={{ marginBottom: aiFavorites.length > 0 ? '1.5rem' : 0 }}>
                                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                                        Favorite Phones
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {favorites.map((phone, i) => (
                                            <div key={i} style={{
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <h3 style={{ margin: 0, color: '#a5b4fc', fontSize: '1.1rem' }}>{phone.model_name || phone.model}</h3>
                                                    <button
                                                        onClick={() => removeFavorite(phone)}
                                                        className="icon-btn"
                                                        style={{ color: 'var(--error)', padding: '0.25rem' }}
                                                        title="Remove from favorites"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                    {phone.price && <div><strong>Price:</strong> ₹{phone.price}</div>}
                                                    {phone.processor && <div><strong>Chip:</strong> {phone.processor.substring(0, 20)}{phone.processor.length > 20 ? '...' : ''}</div>}
                                                    {phone.battery && <div><strong>Battery:</strong> {phone.battery}</div>}
                                                    {phone.display && <div><strong>Display:</strong> {phone.display.substring(0, 20)}{phone.display.length > 20 ? '...' : ''}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Saved AI Answers */}
                            {aiFavorites.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                                        Saved Answers
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {aiFavorites.map((item, i) => (
                                            <div key={i} style={{
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <MessageSquareText size={14} />
                                                        {item.savedAt ? new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Saved answer'}
                                                    </div>
                                                    <button
                                                        onClick={() => removeAiFavorite(item.savedAt)}
                                                        className="icon-btn"
                                                        style={{ color: 'var(--error)', padding: '0.25rem', flexShrink: 0 }}
                                                        title="Remove from saved"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                                    {item.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
