import React, { useRef, useState } from 'react';
import { Plus, X, Camera, Image } from 'lucide-react';

export default function ImageUpload({ selectedImage, onImageSelect, onImageRemove }) {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                if (file.size <= 5 * 1024 * 1024) {
                    onImageSelect(file);
                } else {
                    alert("File size should be less than 5MB");
                }
            } else {
                alert("Only JPG, PNG and WEBP formats are supported");
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
        setShowMenu(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Hidden inputs */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                style={{ display: 'none' }}
            />

            {/* + Button */}
            <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                style={{
                    width: "40px", height: "40px",
                    background: showMenu ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.2)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.4rem", fontWeight: 300,
                    transition: "all 0.2s",
                    transform: showMenu ? "rotate(45deg)" : "rotate(0deg)"
                }}
            >
                <Plus size={20} />
            </button>

            {/* Popup Menu */}
            {showMenu && (
                <div style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: '0',
                    background: 'rgba(15, 23, 42, 0.98)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    minWidth: '160px'
                }}>
                    {/* Camera Option */}
                    <button
                        type="button"
                        onClick={() => { cameraInputRef.current?.click(); setShowMenu(false); }}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.65rem 0.75rem', background: 'none', border: 'none',
                            color: 'white', cursor: 'pointer', borderRadius: '8px',
                            fontSize: '0.9rem', fontWeight: 500,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <div style={{ width: '32px', height: '32px', background: 'rgba(16,185,129,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={16} color="#34d399" />
                        </div>
                        Camera
                    </button>

                    {/* Gallery Option */}
                    <button
                        type="button"
                        onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.65rem 0.75rem', background: 'none', border: 'none',
                            color: 'white', cursor: 'pointer', borderRadius: '8px',
                            fontSize: '0.9rem', fontWeight: 500,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <div style={{ width: '32px', height: '32px', background: 'rgba(99,102,241,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image size={16} color="#818cf8" />
                        </div>
                        Gallery
                    </button>
                </div>
            )}

            {/* Image Preview */}
            {selectedImage && (
                <div style={{
                    position: 'absolute', bottom: '110%', left: '0',
                    marginBottom: '0.5rem',
                    background: 'rgba(30, 41, 59, 0.95)',
                    padding: '0.75rem', borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                    zIndex: 50
                }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                        <button
                            type="button"
                            onClick={onImageRemove}
                            style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: '#ef4444', color: 'white', border: 'none',
                                borderRadius: '50%', width: '24px', height: '24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}