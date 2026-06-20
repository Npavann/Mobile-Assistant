import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, LogOut, FileText } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserUpload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { user, token, logout } = useUserAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/user-login');
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        setStatus(null);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/csv-user`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
            );
            setStatus({ type: 'success', message: `Successfully uploaded ${response.data.count} mobile devices.` });
            setFile(null);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to upload CSV.' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white", fontFamily: "'Inter', sans-serif", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>User Upload Panel</h1>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>Welcome, {user?.name}</p>
                </div>
                <button onClick={handleLogout} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    background: "rgba(239,68,68,0.08)", color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.2)", padding: "0.6rem 1rem", borderRadius: "10px",
                    cursor: "pointer", fontSize: "0.875rem", fontWeight: 500
                }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px", padding: "2rem", maxWidth: "480px", margin: "0 auto"
            }}>
                <div style={{
                    width: "64px", height: "64px", background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem"
                }}>
                    <UploadCloud size={32} color="#34d399" />
                </div>

                <h3 style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Upload Mobile Data</h3>
                <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                    Add new mobile specifications to the AI's knowledge base.
                </p>

                <label style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${file ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", padding: "0.875rem 1rem", cursor: "pointer", marginBottom: "1rem",
                    width: "100%", boxSizing: "border-box"
                }}>
                    <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
                    <div style={{
                        width: "36px", height: "36px", flexShrink: 0,
                        background: file ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                        borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <FileText size={18} color={file ? "#34d399" : "rgba(255,255,255,0.3)"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: file ? "white" : "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {file ? file.name : "Choose CSV File"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports .csv files"}
                        </div>
                    </div>
                </label>

                <button onClick={handleUpload} disabled={!file || isUploading} style={{
                    width: "100%", padding: "0.875rem",
                    background: file && !isUploading ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.06)",
                    border: "none", borderRadius: "12px", color: file && !isUploading ? "white" : "rgba(255,255,255,0.3)",
                    fontSize: "0.95rem", fontWeight: 600, cursor: file && !isUploading ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    boxShadow: file && !isUploading ? "0 4px 15px rgba(16,185,129,0.3)" : "none"
                }}>
                    {isUploading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Uploading...</> : <><UploadCloud size={18} /> Upload to Database</>}
                </button>

                {status && (
                    <div style={{
                        marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: "10px",
                        display: "flex", alignItems: "flex-start", gap: "0.75rem",
                        background: status.type === 'success' ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                        border: `1px solid ${status.type === 'success' ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        color: status.type === 'success' ? "#34d399" : "#f87171", fontSize: "0.85rem", lineHeight: 1.5
                    }}>
                        {status.type === 'success' ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "1px" }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />}
                        {status.message}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}