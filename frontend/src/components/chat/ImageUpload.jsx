import React, { useRef } from 'react';
import { ImagePlus, X, Camera } from 'lucide-react';

export default function ImageUpload({ selectedImage, onImageSelect, onImageRemove }) {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

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
    };

    return (
        <div className="image-upload-container" style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
            {/* Gallery Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                style={{ display: 'none' }}
            />

            {/* Camera Capture */}
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                capture="environment"
                style={{ display: 'none' }}
            />

            {/* Gallery Button */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn"
                style={{
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "#818cf8",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
                title="Upload from Gallery"
            >
                <ImagePlus size={20} />
            </button>

            {/* Camera Button */}
            <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="btn"
                style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#34d399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
                title="Take Photo"
            >
                <Camera size={20} />
            </button>

            {/* Image Preview */}
            {selectedImage && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '0',
                    marginBottom: '1rem',
                    background: 'rgba(30, 41, 59, 0.95)',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    zIndex: 50
                }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                        <button
                            type="button"
                            onClick={onImageRemove}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
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