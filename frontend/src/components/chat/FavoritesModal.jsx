import React, { useState, useEffect } from 'react';
import { X, Trash2, Star } from 'lucide-react';

export default function FavoritesModal({ isOpen, onClose }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
            setFavorites(savedFavorites);
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
                        Favorite Phones
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
                    {favorites.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                            No favorite phones yet.
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
}
