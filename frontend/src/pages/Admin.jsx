import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  pageBg: "radial-gradient(ellipse at 30% 20%, #45437F 0%, #2A2856 38%, #16152E 72%, #0B0A1A 100%)",
  titleText: "#FFFFFF",
  subtitleText: "#B0ADD1",
  logoutBg: "rgba(239,68,68,0.12)",
  logoutBorder: "rgba(239,68,68,0.35)",
  logoutText: "#FCA5A5",
  cardBg: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.14)",
  iconBoxBg: "rgba(99,102,241,0.15)",
  iconBoxBorder: "rgba(99,102,241,0.35)",
  iconColor: "#A5B4FC",
  headingText: "#FFFFFF",
  descText: "#B0ADD1",
  dropzoneBg: "rgba(255,255,255,0.05)",
  dropzoneBorder: "rgba(255,255,255,0.16)",
  dropzoneBorderActive: "rgba(129,140,248,0.5)",
  fileIconBoxBg: "rgba(255,255,255,0.08)",
  fileIconBoxBgActive: "rgba(99,102,241,0.2)",
  fileIconColor: "#8582AC",
  fileIconColorActive: "#A5B4FC",
  fileNameText: "#F5F4FC",
  fileNameTextInactive: "#8582AC",
  fileMetaText: "#7A78A0",
  uploadGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  uploadDisabledBg: "rgba(255,255,255,0.06)",
  uploadDisabledText: "#7A78A0",
  successBg: "rgba(16,185,129,0.12)",
  successBorder: "rgba(16,185,129,0.35)",
  successText: "#6EE7B7",
  errorBg: "rgba(239,68,68,0.12)",
  errorBorder: "rgba(239,68,68,0.35)",
  errorText: "#FCA5A5",
};

export default function Admin() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate('/admin-login');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setStatus(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/csv`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
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
    <div style={{ minHeight: "100vh", background: COLORS.pageBg, color: COLORS.headingText, fontFamily: "'Inter', sans-serif", padding: "1.5rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: COLORS.titleText }}>Database admin</h1>
          <p style={{ color: COLORS.subtitleText, fontSize: "0.8rem", margin: "0.25rem 0 0" }}>Manage mobile phone data</p>
        </div>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: COLORS.logoutBg, color: COLORS.logoutText,
          border: `1px solid ${COLORS.logoutBorder}`,
          padding: "0.6rem 1rem", borderRadius: "10px",
          cursor: "pointer", fontSize: "0.875rem", fontWeight: 500
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Upload Card */}
      <div style={{
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "20px", padding: "2rem",
        maxWidth: "480px", margin: "0 auto"
      }}>
        {/* Icon */}
        <div style={{
          width: "64px", height: "64px",
          background: COLORS.iconBoxBg,
          border: `1px solid ${COLORS.iconBoxBorder}`,
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem"
        }}>
          <UploadCloud size={32} color={COLORS.iconColor} />
        </div>

        <h3 style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: COLORS.headingText }}>Upload mobile data</h3>
        <p style={{ textAlign: "center", color: COLORS.descText, fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Update the AI's knowledge base by uploading a CSV file containing mobile specifications.
        </p>

        {/* File Input */}
        <label style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          background: COLORS.dropzoneBg,
          border: `1px solid ${file ? COLORS.dropzoneBorderActive : COLORS.dropzoneBorder}`,
          borderRadius: "12px", padding: "0.875rem 1rem",
          cursor: "pointer", marginBottom: "1rem",
          transition: "border-color 0.2s", width: "100%", boxSizing: "border-box"
        }}>
          <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
          <div style={{
            width: "36px", height: "36px", flexShrink: 0,
            background: file ? COLORS.fileIconBoxBgActive : COLORS.fileIconBoxBg,
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <FileText size={18} color={file ? COLORS.fileIconColorActive : COLORS.fileIconColor} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.875rem", fontWeight: 500,
              color: file ? COLORS.fileNameText : COLORS.fileNameTextInactive,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>
              {file ? file.name : "Choose CSV file"}
            </div>
            <div style={{ fontSize: "0.72rem", color: COLORS.fileMetaText, marginTop: "2px" }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports .csv files"}
            </div>
          </div>
        </label>

        {/* Upload Button */}
        <button onClick={handleUpload} disabled={!file || isUploading}
          style={{
            width: "100%", padding: "0.875rem",
            background: file && !isUploading ? COLORS.uploadGradient : COLORS.uploadDisabledBg,
            border: "none", borderRadius: "12px",
            color: file && !isUploading ? "#FFFFFF" : COLORS.uploadDisabledText,
            fontSize: "0.95rem", fontWeight: 600,
            cursor: file && !isUploading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            boxShadow: file && !isUploading ? "0 4px 15px rgba(99,102,241,0.3)" : "none",
            transition: "background 0.2s"
          }}>
          {isUploading ? (
            <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Uploading...</>
          ) : (
            <><UploadCloud size={18} /> Upload to database</>
          )}
        </button>

        {/* Status */}
        {status && (
          <div style={{
            marginTop: "1rem", padding: "0.875rem 1rem",
            borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "0.75rem",
            background: status.type === 'success' ? COLORS.successBg : COLORS.errorBg,
            border: `1px solid ${status.type === 'success' ? COLORS.successBorder : COLORS.errorBorder}`,
            color: status.type === 'success' ? COLORS.successText : COLORS.errorText,
            fontSize: "0.85rem", lineHeight: 1.5
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