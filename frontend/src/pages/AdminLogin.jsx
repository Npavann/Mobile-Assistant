import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await login(username, password, false);
      navigate("/admin");
    } catch (err) {
      setError("Wrong username or password.");
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!forgotEmail.trim()) { setForgotError("Please enter your email."); return; }
    setForgotLoading(true); setForgotError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, { email: forgotEmail });
      setOtpSent(true);
      setForgotMsg("OTP sent! Check your inbox.");
    } catch (err) { setForgotError(err.response?.data?.error || "Failed to send OTP."); }
    setForgotLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setForgotError("Please enter the OTP."); return; }
    setForgotLoading(true); setForgotError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, { email: forgotEmail, otp });
      setOtpVerified(true);
      setForgotMsg("✅ Identity verified! Your password is: admin123");
    } catch (err) { setForgotError(err.response?.data?.error || "Invalid OTP."); }
    setForgotLoading(false);
  };

  const resetForgot = () => { setShowForgot(false); setOtpSent(false); setOtpVerified(false); setForgotMsg(""); setForgotError(""); setForgotEmail(""); setOtp(""); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem"
    }}>
      {/* Glowing background circles */}
      <div style={{ position: "fixed", top: "10%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }}>

        {!showForgot ? (
          <>
            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{
                width: "64px", height: "64px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
              }}>
                <ShieldCheck size={32} color="white" />
              </div>
              <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Admin Portal</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.25rem" }}>MobileAssist AI Dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Username */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}>
                  <Lock size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "white", fontSize: "0.95rem",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%", padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "white", fontSize: "0.95rem",
                    outline: "none", boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem" }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} style={{
                width: "100%", padding: "0.875rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", borderRadius: "12px",
                color: "white", fontSize: "1rem", fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                opacity: isSubmitting ? 0.7 : 1,
                marginTop: "0.5rem"
              }}>
                {isSubmitting ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Sign In"}
              </button>
            </form>

            {/* Forgot */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <span onClick={() => setShowForgot(true)} style={{ color: "#818cf8", fontSize: "0.875rem", cursor: "pointer", textDecoration: "underline" }}>
                Forgot password?
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Forgot Password */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <button onClick={resetForgot} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", color: "white", display: "flex" }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Reset Password</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!otpSent ? (
                <>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", margin: 0 }}>Enter your admin email to receive an OTP.</p>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="Admin email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px", color: "white", fontSize: "0.95rem",
                        outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <button onClick={handleSendOtp} disabled={forgotLoading} style={{
                    width: "100%", padding: "0.875rem",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none", borderRadius: "12px",
                    color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {forgotLoading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Send OTP"}
                  </button>
                </>
              ) : !otpVerified ? (
                <>
                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem", textAlign: "center" }}>
                    {forgotMsg}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{
                      width: "100%", padding: "0.875rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px", color: "white", fontSize: "1.5rem",
                      fontWeight: 700, letterSpacing: "0.5rem",
                      textAlign: "center", outline: "none", boxSizing: "border-box"
                    }}
                  />
                  <button onClick={handleVerifyOtp} disabled={forgotLoading} style={{
                    width: "100%", padding: "0.875rem",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none", borderRadius: "12px",
                    color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {forgotLoading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Verify OTP"}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", padding: "1rem", borderRadius: "12px", fontSize: "0.95rem", marginBottom: "1rem" }}>
                    {forgotMsg}
                  </div>
                  <button onClick={resetForgot} style={{
                    width: "100%", padding: "0.875rem",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none", borderRadius: "12px",
                    color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer"
                  }}>
                    Back to Login
                  </button>
                </div>
              )}

              {forgotError && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem", textAlign: "center" }}>
                  {forgotError}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}