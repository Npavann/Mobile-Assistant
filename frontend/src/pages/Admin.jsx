import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus({ 
        type: 'success', 
        message: `Successfully uploaded and parsed ${response.data.count} mobile devices.` 
      });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to upload CSV. Ensure the backend is running.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Database Admin</h1>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={18} />
          <span style={{ marginLeft: '0.5rem' }}>Logout</span>
        </button>
      </div>
      
      <div className="admin-grid">
        <div className="upload-card">
          <div className="upload-icon">
            <UploadCloud size={40} />
          </div>
          <h3>Upload Mobile Data</h3>
          <p>Update the AI's knowledge base by uploading a CSV file containing mobile specifications.</p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="file-label">
              <input type="file" accept=".csv" onChange={handleFileChange} />
              {file ? file.name : 'Choose CSV File'}
            </label>
          </div>
          
          <button 
            className="btn" 
            style={{ width: '100%' }}
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <><Loader2 className="loader" size={18} /> Uploading...</>
            ) : (
              'Upload to Database'
            )}
          </button>

          {status && (
            <div className={`status-message ${status.type}`}>
              {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
